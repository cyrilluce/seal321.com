import { dbs, ServerId, mainDb, Table } from '../../config';
import * as Koa from "koa"
import * as Router from "koa-router";
import * as compose from "koa-compose";
import * as mysql from 'mysql';
import { getConnectionAsync } from '../../lib/mysql';
import { promisify, promiseCall } from '../../util';
import logger from '../../logger';
import list from './list';
import item from './item';
import setopt from './setopt';
import craft from './craft';
import version from './version';

interface QueryRequest extends Koa.Request {
    body: any;
}

export interface QueryContext extends Koa.Context {
    withConn: IWithConn;
    logger: typeof logger;
    success: (data: any) => void;
    failure: (msg: string) => void;
    request: QueryRequest;
    getTableName: (table: Table)=>string;
}

let router = new Router();
// success与failure方法
async function shortcutResponse(ctx: QueryContext, next) {
    ctx.logger = logger;
    ctx.success = function (data) {
        ctx.body = {
            success: true,
            data: data
        }
    };
    ctx.failure = function (msg) {
        ctx.body = {
            success: false,
            message: msg
        }
    };
    return next();
}

type IWithConnTask = (conn?: mysql.IConnection, query?: (...args: any[]) => Promise<any[]>) => Promise<any>;
type IWithConn = (task: IWithConnTask) => Promise<any>;

// 统一校验，服务器、db，初始化数据库连接
async function ensureDb(ctx: QueryContext, next) {
    const loc: ServerId = ctx.request.body.loc || mainDb;
    if (!(loc in dbs)) {
        return ctx.failure('无此主数据库');
    }
    ctx.request.body.loc = loc;

    ctx.getTableName = (name)=>`seal_${loc}_${name}`;

    ctx.withConn = async (asyncTask: IWithConnTask) => {
        let conn: mysql.IConnection;
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

    try{
        await next();
    }catch(err){
        ctx.logger.error(ctx.request.path, err);
        ctx.failure(err.message);
    }
};

router.use(shortcutResponse).use(ensureDb);
router.post('/list', list);
router.post('/item', item);
router.post('/setopt', setopt);
router.post('/craft', craft);
router.post('/version', version);
export default router.routes();