import {ServerId, Table, dbs} from '../../config';
import { SetOption } from '../../types';
import { QueryContext } from '.';

export interface Query{
    loc: ServerId;
    id: number|number[];
}

interface SetOptions{
    [level: number]: SetOption;
}

export interface Result{
    [id:number]: SetOptions;
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

    const tableName = ctx.getTableName('setopt');

    await ctx.withConn(async (conn, query)=>{
        const data: SetOption[] = await query(`SELECT * FROM ${tableName} WHERE id in ?`, [ids]);

        const map:Result = {};
        (data || []).forEach(item=>{
            let optionsMap = map[item.id] || (map[item.id] = {});
            optionsMap[item.count] = item;
        })

        ctx.success(map);
    });
}