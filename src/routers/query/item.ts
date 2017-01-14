import {ServerId, Table, dbs} from '../../config';
import { Item } from '../../types';
import { QueryContext } from '.';

interface Query{
    loc: ServerId;
    id: number|number[];
}

interface Result{
    [id:number]: Item;
}

export default async function(ctx: QueryContext, next){
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

    await ctx.withConn(async (conn, query)=>{
        const data = await query(`SELECT * FROM ${tableName} WHERE id in ?`, [ids]);

        const map:Result = {};
        (data || []).forEach(item=>{
            map[item.id] = item;
        })

        ctx.success(map);
    });
}