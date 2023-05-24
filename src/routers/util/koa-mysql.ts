import logger from "../../logger";
import { Request, Context } from "koa";
import { IConnection } from "mysql";
import { getConnectionAsync } from "../../lib/mysql";
import { promisify, promiseCall } from "../../util";

type IWithConnTask = (
  conn?: IConnection,
  query?: <T = any>(...args: any[]) => Promise<T[]>
) => Promise<any>;
type IWithConn = (task: IWithConnTask) => Promise<any>;

export interface QueryContext extends Context {
  session: any;
  withConn: IWithConn;
  logger: typeof logger;
}

export default async function withConn(ctx: QueryContext, next) {
  ctx.logger = logger;
  ctx.withConn = async (asyncTask: IWithConnTask) => {
    let conn: IConnection;
    let data;
    try {
      conn = await getConnectionAsync();
      let query = promisify<any[]>(conn.query, conn);
      data = await asyncTask(conn, query);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
    return data;
  };

  try {
    await next();
  } catch (err) {
    ctx.logger.error(ctx.request.path, err);
  }
}
