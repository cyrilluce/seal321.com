/**
 * Created by cyrilluce on 2016/4/24.
 */
var SealUtil = require('./build/Release/SealUtil.node');
console.log(SealUtil.decrypt);
console.log(SealUtil.encrypt);

console.log(SealUtil.encrypt(new Buffer('abcdef')));