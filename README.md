#0. git clone后
cnpm i
然后复制tools/updater/override/下的文件到node_modules/mt-downloader/src/下
cnpm run dev 运行
浏览器访问 http://localhost 

#0. 环境搭建


#1. 更新包下载解压器
npm run watch

#1.1 国服更新包
下载 http://seal.download.kunlun.com/conf.kl  zip格式，解压后查看最新版本
然后拼接版本号，例如200版本的item.edp  http://seal.autopatch.kunlun.com/fullversions/200/etc/item.edp

#2. 提取数据
ts-node pickup cn item
ts-node pickup cn craft
ts-node pickup cn monster
ts-node pickup cn setopt

#2.1 批量提取物品图标
ts-node tools/findNewer tw2 item
cd F:/seal-samples/tw2/source/item/noVersion
pickupTex
DDS Convertor

有时tw的更新
cd F:/webwork/seal321
ts-node tools/findNewer t2 item
cd F:/seal-samples/tw2/source/item/noVersion
pickupTex
DDS Convertor

#2.2 提取服务端掉落
ts-node tools/dropPicker/index

#3. 发布数据
ts-node deploy file www/favicon.ico
ts-node deploy restart
ts-node deploy publish

ts-node deploy db tw2 craft

ts-node deploy db tw craft
ts-node deploy db tw monster

ts-node deploy db us craft
ts-node deploy db us monster

ts-node deploy db cn craft
ts-node deploy db cn monster