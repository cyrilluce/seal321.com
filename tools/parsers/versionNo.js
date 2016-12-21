/**
 * 将0.1.23 转为数字 0000 0001 0023，基本上可以通吃所有版本了，避免出现 0.1.23<0.1.3 的情况
 * Created by cyrilluce on 2016/5/29.
 */
module.exports = function(v){
    var a = v.split(".");
    var i, c=0;
    while(a.length>0){
        i=parseInt(a.shift());
        c = c * 10000 + i;
    }
    return c;
};