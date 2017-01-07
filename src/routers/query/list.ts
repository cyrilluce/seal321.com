import * as mysql from 'mysql';
import {getConnectionAsync} from '../../lib/mysql';
import {ServerId, Table, dbs} from '../../config';
import logger from '../../logger';
import {success, failure} from '../util';
import promisify from '../../util/promisify';
import {waterfall} from 'async';

interface Query{
    loc: ServerId;
    keyword: string;
    offset?: number;
    limit?: number;
}

function constrain(v:number, min:number, max:number): number{
    v = v || 0;
    v = Math.max(min, v);
    v = Math.min(max, v);
    return v;
}

export default async function(req, res){
    const query: Query = req.body;
    const table: Table = "item";
    const {
        loc : db,
        keyword = "",
        offset = 0,
        limit = 20
    } = query;
    // 模糊搜索
    const keywordSearch = '%' + keyword.replace(/(%_)/g, '\\$1') + '%';

    logger.info('搜索', keyword, offset, limit);

    const tableName = `seal_${db}_${table}`;
    let conn: mysql.IConnection;
    try{
        conn = await getConnectionAsync();
        const queryAsync = promisify<any[]>(conn.query, conn);

        const [data, countData] = await Promise.all([
            queryAsync(`SELECT * FROM ${tableName} WHERE name like ? limit ?,?`,
                [keywordSearch, constrain(offset, 0, 1000000), constrain(limit, 0, 100)]),
            queryAsync(`SELECT count(*) as count FROM ${tableName} WHERE name like ?`, [keywordSearch])
        ]);

        res.json(success({
            list : data,
            count : countData[0] && countData[0].count || 0
        }));
    }catch(err){
        logger.error('query/list', err);
        res.json(failure(err.message));
    }finally{
        if(conn){
            conn.release();
        }
    }
}