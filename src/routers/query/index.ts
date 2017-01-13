import {dbs, ServerId, mainDb} from '../../config';
import * as Router from "koa-router";
import * as compose from "koa-compose";
import list from './list';
import item from './item';

let router = new Router();
// success与failure方法
async function shortcutResponse(ctx, next){
    ctx.success = function(data){
        ctx.body = {
            success : true,
            data : data
        }
    };
    ctx.failure = function(msg){
        ctx.body = {
            success : false,
            message : msg
        }
    };
    return next();
}

// 统一校验，服务器、db
async function ensureDb(ctx, next){
    const loc:ServerId = ctx.request.body.loc || mainDb;
    if(!(loc in dbs)){
        return ctx.failure('无此主数据库');
    }
    ctx.request.body.loc = loc;
    return next();
};

router.use(shortcutResponse).use(ensureDb);
router.post('/list', list);
router.post('/item', item);
export default router.routes();