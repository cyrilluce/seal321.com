0. svn get后
cnpm i
然后复制tools/updater/override/下的文件到node_modules/mt-downloader/src/下
cnpm run dev 运行
浏览器访问 http://localhost 

0. 环境搭建


1. 更新包下载解压器
npm run watch

2. 提取数据
ts-node pickup tw2 item
craft
monster
setopt

3. 发布数据
ts-node deploy file www/favicon.ico
ts-node deploy db tw2 item
ts-node deploy restart
ts-node deploy publish