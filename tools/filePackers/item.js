/**
 * Created by cyrilluce on 2016/8/7.
 */
"use strict";
var fs = require('fs');
var path = require('path');
var config = require('../config');
var Base = require('./Base');
var EdtPacker = require('../packers/Edt');
var logger = require('../logger').delegate('ItemFilePacker');

// edt - amos[] - edt - item
class SetOptPacker extends Base{
    constructor(serverId, version="*") {
        super(serverId, version);
        this.amosPacker = new this.AmosPacker();
        this.subEdtPackers = [];
    }
    getFileName(index){
        return index ? `ITEM.ED${index}` : 'ITEM.EDT';
    }
    unpack(data){
        data = this.edtPacker.unpack(data);

        var files = this.amosPacker.unpack(data, this.server.encoding);
        var fileMap = {};
        files.forEach(file=>{
            fileMap[file.name] = file.data;
        });

        let elements = [];
        let idRepeat = {};
        for(let i=0; ;i++){
            let fileName = this.getFileName(i);
            if(!(fileName in fileMap)){
                logger.info(`没有${fileName}，子文件结束`);
                break;
            }
            logger.info(`开始解析${fileName}`);
            let edtPacker = this.subEdtPackers[i] = this.subEdtPackers[i] || new EdtPacker();
            let fileData = edtPacker.unpack(fileMap[fileName]);
            let items = this.packer.unpack(fileData, this.server.encoding);
            items.forEach(item=>{
                if(item.id in idRepeat){
                    return;
                }
                idRepeat[item.id] = 1;
                elements.push(item);
            });
        }

        // fs.writeFileSync(path.join(config.samplesDir, 'source._edt'), data);
        return elements;
    }
    pack(elements){
        const sizePerFile = 1000;
        let files = [];
        for(let fileIndex=0; fileIndex*sizePerFile<elements.length; fileIndex++){
            let items = elements.slice(fileIndex*sizePerFile, (fileIndex+1)*sizePerFile);
            let fileData = this.packer.pack(items, this.server.encoding);
            let edtPacker = this.subEdtPackers[fileIndex] = this.subEdtPackers[fileIndex]|| new EdtPacker();
            fileData = edtPacker.pack(fileData);
            files.push({
                name : this.getFileName(fileIndex),
                data : fileData
            });
        }
        var data = this.amosPacker.pack(files, this.server.encoding);
        return this.edtPacker.pack(data);
    }
}

Object.assign(SetOptPacker.prototype, {
    AmosPacker : require('../packers/Amos'),
    Packer : require('../packers/Item')
});

module.exports = SetOptPacker;