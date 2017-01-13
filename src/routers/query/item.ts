import * as mysql from 'mysql';
import {getConnectionAsync} from '../../lib/mysql';
import {ServerId, Table, dbs} from '../../config';
import logger from '../../logger';
import { Item } from '../../types';
import {promisify} from '../../util';

interface Query{
    loc: ServerId;
    id: number|number[];
}

interface Result{
    [id:number]: Item;
}

export default async function(ctx, next){
    const query: Query = ctx.request.body;
    const table: Table = "item";
    const {
        loc : db,
        id
    } = query;
    // 只能是数字，最大100条
    const ids = [].concat(id).filter(id=>{
        return +id>0;
    }).slice(0, 100);

    const tableName = `seal_${db}_${table}`;
    let conn: mysql.IConnection;
    try{
        conn = await getConnectionAsync();
        const queryAsync = promisify<any[]>(conn.query, conn);

        const data = await queryAsync(`SELECT * FROM ${tableName} WHERE id in (?)`, [ids]);

        const map:Result = {};
        (data || []).forEach(item=>{
            map[item.id] = item;
        })

        ctx.success(map);
    }catch(err){
        logger.error('query/item', err);
        ctx.failure(err.message);
    }finally{
        if(conn){
            conn.release();
        }
    }
}