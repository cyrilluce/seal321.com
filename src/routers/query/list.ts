import { ServerId, Table, dbs } from '../../config';
import { Item } from '../../types';
import { QueryContext, Condition } from '.';

export interface Query {
    loc: ServerId;
    keyword: string;
    type?: number[];
    offset?: number;
    limit?: number;
}

export interface Result {
    list : Item[];
    count: number;
}

function constrain(v: number, min: number, max: number): number {
    v = v || 0;
    v = Math.max(min, v);
    v = Math.min(max, v);
    return v;
}

export default async function (ctx: QueryContext, next) {
    const query: Query = ctx.request.body;
    const {
        loc: db,
        keyword = "",
        type,
        offset = 0,
        limit = 20
    } = query;
    
    
    const conditions: Condition[] = [];

    if(keyword){
        conditions.push({
            // 模糊搜索
            sql : 'name like ?',
            values : ['%' + keyword.replace(/(%_)/g, '\\$1') + '%']
        })
    }

    // 类型只能是数字
    const types = [].concat(type).filter(type=>{
        return +type>=0
    });
    if(types.length){
        conditions.push({
            sql : 'type in (?)',
            values : [types]
        })
    }

    let sqls: string[] = [];
    let values: any[] = [];
    if(conditions.length){
        sqls.push(`WHERE ${conditions.map(cond=>cond.sql).join(' AND ')}`);
        conditions.forEach(cond=>{
            values = values.concat(cond.values);
        })
    }
    const noLimitSql = sqls.join(' ');
    const noLimitValues = values;

    sqls.push('LIMIT ?,?');
    values = values.concat([
        constrain(offset, 0, 1000000),
        constrain(limit, 0, 100)
    ])

    ctx.logger.info('搜索', db, keyword, offset, limit);

    const tableName = ctx.getTableName('item');

    const [data, countData] = await Promise.all([
        ctx.withConn((conn, query) => {
            
             return query(`SELECT * FROM ${tableName} ${sqls.join(' ')}`, values);
        }),
        ctx.withConn((conn, query) => {
            return query(`SELECT count(*) as count FROM ${tableName} ${noLimitSql}`, noLimitValues);
        }),
    ]);
    // ctx.logger.info(data, countData);
    let result: Result = {
        list: data,
        count: countData && countData[0] && countData[0].count || 0
    }
    ctx.success(result);
}