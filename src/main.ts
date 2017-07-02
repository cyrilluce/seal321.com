/**
 * Created by cyrilluce on 2016/8/7.
 */
import logger from "./logger";
import * as http from "http";
import * as net from "net";
import * as fs from "fs";
import * as Koa from "koa";
import web from "./routers/web";
import deploy from "./routers/deploy";
import * as session from "koa-session";
import * as localConfig from "./localConfig";

process.on("unhandledrejection", (reason, p) => {
  logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
  throw reason;
});

process.on("uncaughtException", function(e) {
  logger.error(e);
  logger.error(e.stack);
});
// 发布工具
new Koa().use(deploy).listen(localConfig.deployPort, "0.0.0.0", function() {
  logger.info("远程发布服务监听于 ", localConfig.deployPort);
});

// web服务
const app = new Koa();
app.keys = ["grant"];
app.use(session(app));
app.use(web).listen(localConfig.nginxWebPort, "0.0.0.0", () => {
  logger.info("Web服务监听于", localConfig.nginxWebPort);
});
