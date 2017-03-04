import {ServerId, Table, dbs} from '../../config';
import { Item } from '../../types';
import { QueryContext } from '.';

export interface Query{
    loc: ServerId;
    id: number|number[];
    type?: number[];
}

export interface Result{
    [id:number]: Item;
}

export default async function(ctx: QueryContext, next){
    const query: Query = ctx.request.body;
    const {
        loc : db,
        id,
        type
    } = query;
    // 只能是数字，最大100条
    const ids = [].concat(id).filter(id=>{
        return +id>0;
    }).slice(0, 100);
    // 类型也只能是数字
    const types = [].concat(type).filter(type=>{
        return +type>=0
    });
    const conditions: string[] = [
        'id in (?)'
    ];
    const values: any[] = [
        ids
    ];
    if(types.length){
        conditions.push('type in (?)');
        values.push(types);
    }

    const tableName = ctx.getTableName('item');

    await ctx.withConn(async (conn, query)=>{
        const data = await query(`SELECT * FROM ${tableName} WHERE ${conditions.join(' and ')} `, values);

        const map:Result = {};
        (data || []).forEach(item=>{
            map[item.id] = item;
        })

        ctx.success(map);
    });
}