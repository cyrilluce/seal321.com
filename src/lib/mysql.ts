/**
 * Created by cyrilluce on 2016/8/7.
 */
import * as mysql from 'mysql';
import {mysql as mysqlConfig} from '../config';
var pool  = mysql.createPool(Object.assign({
    connectionLimit : 10,
    // debug : true
}, mysqlConfig));

export default pool;