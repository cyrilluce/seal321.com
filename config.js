/**
 * Created by cyrilluce on 2016/8/7.
 */
module.exports = {
    localHotLoadPort : 3000,
    deployServer : 'beta.seal321.com',
    deployPort : 7001,
    nginxWebPort : 80,
    mainDb : 'cn',

    mysql : {
        host : 'localhost',
        user : 'root',
        password : '123456',
        database : 'seal-v2'
    },

    dbs : {
        cn : {
            item : 1,
            monster : 1
        },
        us : {
            item : 1
        },
        tw2 : {
            item : 1
        }
    }
};