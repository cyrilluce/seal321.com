import { ServerId, Table, dbs } from '../../config';
import { QueryContext } from '.';

interface Query {
    loc: ServerId;
    keyword: string;
    offset?: number;
    limit?: number;
}

function constrain(v: number, min: number, max: number): number {
    v = v || 0;
    v = Math.max(min, v);
    v = Math.min(max, v);
    return v;
}

export default async function (ctx: QueryContext, next) {
    const query: Query = ctx.request.body;
    const table: Table = "item";
    const {
        loc: db,
        keyword = "",
        offset = 0,
        limit = 20
    } = query;
    // 模糊搜索
    const keywordSearch = '%' + keyword.replace(/(%_)/g, '\\$1') + '%';

    ctx.logger.info('搜索', keyword, offset, limit);

    const tableName = `seal_${db}_${table}`;

    const [data, countData] = await Promise.all([
        ctx.withConn((conn, query) => {
             return query(`SELECT * FROM ${tableName} WHERE name like ? limit ?,?`,
                 [keywordSearch, constrain(offset, 0, 1000000), constrain(limit, 0, 100)]);
        }),
        ctx.withConn((conn, query) => {
            return query(`SELECT count(*) as count FROM ${tableName} WHERE name like ?`, [keywordSearch]);
        }),
    ]);
    // ctx.logger.info(data, countData);
    ctx.success({
        list: data,
        count: countData && countData[0] && countData[0].count || 0
    });
}