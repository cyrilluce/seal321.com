/**
 *
 * Created by cyrilluce on 2016/8/8.
 */
import { parse } from 'url';
import reactRouter from "./react";
import Koa from "koa";
import { koaLogger } from "./util";
import favicon from "koa-favicon";
import serve from "koa-static";
import Router from "koa-router";
import compose from "koa-compose";
import compress from "koa-compress";
import bodyParser from "koa-bodyparser";
import * as path from "path";
import * as fs from "fs";
import mount from "koa-mount";
import Grant from "grant-koa";
import { oAuthList } from "../config";
import { grantConfig as baseGrantConfig } from "../localConfig";
import { grantConfig } from "../securityConfig";
import logger from "../logger";
import query from "./query";
import react from "./react";
import withConn, { QueryContext } from "./util/koa-mysql";
import { GrantAPI } from "./util/grants";
import * as grantAPIs from "./util/grants";

const accountTable = "account";

let router = new Router();

// 本地调试
let webpack = async (ctx, next) => {
  return next();
};
if (process.env.NODE_ENV === "development") {
  webpack = require("./webpack").default;
}

let debug = str => async (ctx, next) => {
  console.log(str, "start", ctx.respond);
  await next();
  console.log(str, "end", ctx.respond);
};

let wwwRoot = "../../www";
if (process.env.NODE_ENV === "development" && /\.js$/.test(__filename)) {
  wwwRoot = "../" + wwwRoot;
}

router.use(bodyParser());
router.use("/node/query", query);
router.get(["/", "/:loc", "/:loc/db"], react);
router.get(
  "(.*)",
  serve(path.join(__dirname, wwwRoot), {
    maxage: process.env.NODE_ENV === "development" ? 0 : 7 * 24 * 60 * 60 * 1000
  })
);

const oAuthAPIs: {[provider: string]: GrantAPI} = {};
oAuthList.forEach(type=>{
  oAuthAPIs[type] = grantAPIs[type]
})
router.use(
  "/oauth/callback/:provider",
  compose([
    withConn,
    async (ctx: QueryContext, next) => {
      console.log(ctx.query);
      console.log(ctx.session.grant);

      const grant = ctx.session.grant;
      // 信息只使用一次
      delete ctx.session.grant;
      
      const type = grant.provider;
      let id;
      let api: GrantAPI = oAuthAPIs[type];
      if (!api || !grant || !grant.response || !grant.response.access_token) {
        ctx.body = `登录失败`;
        return next();
      }

      const queryId = api.getId(
        grant.response.access_token,
        grant.response.raw
      );

      await ctx.withConn(async (conn, query) => {
        let firstCreate = false;
        const gid = await queryId;
        let data = await query(
          `SELECT * FROM ${accountTable} WHERE ${type}=?`,
          [gid]
        );

        // TODO 有另一种情况，同时绑定多个帐号？先不做吧...
        if (!data.length) {
          // 不存在此用户，新建之
          await query(`INSERT INTO ${accountTable} (${type}) VALUES (?)`, [
            gid
          ]);
          data = await query(`SELECT * FROM ${accountTable} WHERE ${type}=?`, [
            gid
          ]);
          firstCreate = true;
        }
        const user = data[0];

        const updates = [
          (async () => {
            const name = await api.getName(
              grant.response.access_token,
              grant.response.raw
            );
            if (name) {
              await query(`UPDATE ${accountTable} SET name=? where id=?`, [
                name,
                user.id
              ]);
              user.name = name;
            }
          })(),
          (async () => {
            const email = await api.getEmail(
              grant.response.access_token,
              grant.response.raw
            );
            if (email) {
              await query(`UPDATE ${accountTable} SET email=? where id=?`, [
                email,
                user.id
              ]);
              user.email = email;
            }
          })(),
          (async () => {
            const avator = await api.getAvator(
              grant.response.access_token,
              grant.response.raw
            );
            if (avator) {
              await query(`UPDATE ${accountTable} SET avator=? where id=?`, [
                avator,
                user.id
              ]);
              user.avator = avator;
            }
          })()
        ];

        // 首次创建，等待更新字段完成
        if (firstCreate) {
          await Promise.all(updates);
        }

        // 登录态
        ctx.session.user = user;

        ctx.logger.info("用户登录", type, user);

        const url = grant.dynamic && grant.dynamic.url
        if(url){
          const urlObj = parse(url);
          if(urlObj.host === baseGrantConfig.server.host){
            ctx.redirect(url);
            return next();
          }
        }

        ctx.body = `登录成功！${JSON.stringify(user)}`

        await next();
      });
    }
  ])
);

export default compose([
  webpack,
  koaLogger(logger),
  compress(),
  favicon(path.join(__dirname, wwwRoot, "favicon.ico")),
  mount(new Grant({ ...baseGrantConfig, ...grantConfig })),
  router.routes()
]);
