/**
 * 找出更新的文件
 * Created by cyrilluce on 2016/11/30.
 */
var fs = require('fs'),
    path = require('path'),
    config = require('./config'),
    mkdirp = require('mkdirp'),
    parseVersionNo = require('./parsers/versionNo');

const [, , serverId, type] = process.argv;
const root = path.join(config.samplesDir, serverId, 'source', type);
const destDir = 'noVersion';

const logger = require('./logger').delegate('当前版本文件导出', serverId, type);

fs.readdir(root, (err, files)=>{
    if(err) {
        console.error(err)
        return;
    }
    let map = {},
        newestVersions = {};

    files.forEach(name=>{
        const match = name.match(/^(.*)\.(\d+\.\d+)$/);
        if(!match){
            return;
        }
        const [, fileName, version] = match;
        const versionNo = parseVersionNo(version);
        if(fileName in newestVersions || newestVersions[fileName] > versionNo){
            return;
        }
        newestVersions[fileName] = versionNo;
        map[fileName] = name;
    });

    mkdirp(path.join(root, destDir), ()=>{
        Object.keys(map).forEach(fileName=>{
            const fullName = map[fileName];
            logger.info(fullName, 'to', fileName);
            fs.createReadStream(path.join(root, fullName)).pipe(fs.createWriteStream(path.join(root, destDir, fileName)));
        });
    });
});