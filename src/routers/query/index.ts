import * as express from 'express';
import {dbs, ServerId, mainDb} from '../../../config';
import {success, failure} from '../util';

import list from './list';

let router = express.Router();

// 统一校验，服务器、db
router.use(function(req, res, next){
    const loc:ServerId = req.query.loc || mainDb;
    if(!(loc in dbs)){
        return res.json(failure('无此主数据库'));
    }
    req.query.loc = loc;
    next();
});

router.use('/list', list);

export default router;