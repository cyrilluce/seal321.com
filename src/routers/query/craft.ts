import {ServerId, Table, dbs} from '../../config';
import { Craft } from '../../types';
import { QueryContext } from '.';

export interface Query{
    loc: ServerId;
    id: number|number[];
}

export interface Result{
    [id:number]: Craft;
}

export default async function(ctx: QueryContext, next){
    const query: Query = ctx.request.body;
    const {
        loc : db,
        id
    } = query;
    // 只能是数字，最大100条
    const ids = [].concat(id).filter(id=>{
        return +id>0;
    }).slice(0, 100);

    const tableName = ctx.getTableName('craft');

    await ctx.withConn(async (conn, query)=>{
        const data: Craft[] = await query(`SELECT * FROM ${tableName} WHERE id in (?)`, [ids]);

        const map:Result = {};
        (data || []).forEach(item=>{
            map[item.id] = item;
        })

        ctx.success(map);
    });
}