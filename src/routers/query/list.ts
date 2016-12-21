import * as mysql from 'mysql';
import mysqlPool from '../../lib/mysql';
import {ServerId, Table, dbs} from '../../config';
import logger from '../../logger';
import {success, failure} from '../util';
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

export default function(req, res){
    const query: Query = req.query;
    const table: Table = "item";
    const {
        loc : db,
        keyword,
        offset = 0,
        limit = 20
    } = query;

    const tableName = `seal_${db}_${table}`;
    mysqlPool.getConnection((err, conn)=>{
        if(err){
            logger.error('query/list', err);
            return res.json(failure(err.message));
        }
        conn.query(`SELECT * FROM ${tableName} WHERE name like ? limit ?,?`,
            [keyword, constrain(offset, 0, 1000000), constrain(limit, 0, 100)],
            (err, data)=>{
                if(err){
                    return res.json(failure('查询数据库失败：'+err.message));
                }
                res.json(success(data));
            });
    });
}