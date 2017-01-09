0. svn get后
cnpm i
然后复制tools/updater/override/下的文件到node_modules/mt-downloader/src/下
cnpm run dev 运行
浏览器访问 http://localhost 

0. 环境搭建


1. 更新包下载解压器
node tools/watch

2. 提取数据
node pickup tw2 item *
craft
monster
setopt

3. 发布数据
ts-node deploy file server/test.js frontend/js/main.js
ts-node deploy db tw2 item 0.654
ts-node deploy restart