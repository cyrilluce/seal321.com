/**
 *
 * Created by cyrilluce on 2016/8/8.
 */
import reactRouter from "./react";
import Koa from "koa";
import { koaLogger } from "./util";
import * as favicon from "koa-favicon";
import * as serve from "koa-static";
import * as Router from "koa-router";
import * as compose from "koa-compose";
import * as compress from "koa-compress";
import * as bodyParser from "koa-bodyparser";
import * as path from "path";
import * as fs from "fs";
import * as mount from "koa-mount";
import * as Grant from "grant-koa";
import * as config from "../config";
import { grantConfig as baseGrantConfig } from "../localConfig";
import { grantConfig } from "../securityConfig";
import logger from "../logger";
import * as cookieParser from "cookie-parser";
import query from "./query";
import react from "./react";
import withConn, { QueryContext } from "./util/koa-mysql";
import { weibo, google, facebook, GrantAPI } from "./util/grants";

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

router.use(
  "/oauth/callback/:provider",
  compose([
    withConn,
    async (ctx: QueryContext, next) => {
      console.log(ctx.query);
      console.log(ctx.session.grant);

      const grant = ctx.session.grant;
      const type = grant.provider;
      let id;
      let api: GrantAPI;
      switch (type) {
        case "weibo":
          api = weibo;
          break;
        case "google":
          api = google;
          break;
        case "facebook":
          api = facebook;
          break;
      }
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
