import { dbs, ServerId, mainDb, Table } from '../../config';
import * as Koa from "koa"
import * as Router from "koa-router";
import * as compose from "koa-compose";
import * as mysql from 'mysql';
import withConn, { QueryContext as BaseQueryContext } from '../util/koa-mysql';
import { getConnectionAsync } from '../../lib/mysql';
import { promisify, promiseCall } from '../../util';
import logger from '../../logger';
import list from './list';
import item from './item';
import setopt from './setopt';
import craft from './craft';
import version from './version';
import howget from './howget';

interface QueryRequest extends Koa.Request {
    body: any;
}

export interface QueryContext extends BaseQueryContext {
    success: (data: any) => void;
    failure: (msg: string) => void;
    request: QueryRequest;
    getTableName: (table: Table)=>string;
}

/** 查询条件 */
export interface Condition {
    sql : string;
    values : any[]
}

let router = new Router();
// success与failure方法
async function shortcutResponse(ctx: QueryContext, next) {
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

    try{
        await next();
    }catch(err){
        ctx.logger.error(ctx.request.path, err);
        ctx.failure(err.message);
    }
};

router.use(withConn).use(shortcutResponse).use(ensureDb);
router.post('/list', list);
router.post('/item', item);
router.post('/setopt', setopt);
router.post('/craft', craft);
router.post('/version', version);
router.post('/howget', howget);
export default router.routes();