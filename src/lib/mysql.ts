/**
 * Created by cyrilluce on 2016/8/7.
 */
import * as mysql from 'mysql';
import {mysql as mysqlConfig} from '../localConfig';
import {promisify} from '../util';
const pool  = mysql.createPool(Object.assign({
    connectionLimit : 10,
    // debug : true
}, mysqlConfig));

export default pool;

export const getConnectionAsync = promisify<mysql.IConnection>(pool.getConnection, pool);