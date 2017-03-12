/**
 * Created by cyrilluce on 2016/8/7.
 */
var logger = require('./logger');
// 别出错
process.on('uncaughtException', function(e){
	logger.error('uncaughtException', e, e.stack);
});
// 下载更新包
require('./watchers/updater');

// 监听更新包，自动解压
require('./watchers/unzipper');

// 自动提取
require('./watchers/pickuper');

// 自动发布
require('./watchers/publisher');