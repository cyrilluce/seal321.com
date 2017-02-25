import {ServerId, Table, dbs} from '../../config';
import { QueryContext } from '.';

export interface Query{
    loc: ServerId;
}

interface Version{
    loc: ServerId;
    type: string;
    version: string;
    time: number;
}

export interface Result{
    [type:string]: {
        version: string;
        time: number;
    };
}

export default async function(ctx: QueryContext, next){
    const query: Query = ctx.request.body;
    const {
        loc : db
    } = query;

    const tableName = `seal_version`;

    ctx.logger.info('查询版本', db);

    await ctx.withConn(async (conn, query)=>{
        const data: Version[] = await query(`SELECT * FROM ${tableName} WHERE loc=?`, [db]);

        const map:Result = {};
        
        data.forEach(row=>{
            map[row.type] = {
                version: row.version,
                time: row.time
            }
        });

        ctx.success(map);
    });
}