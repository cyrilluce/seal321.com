"use strict";
/**
 * Created by cyrilluce on 2016/8/7.
 */
var fs = require('fs');
var path = require("path");
var config = require('../config');
var EdtPacker = require('../packers/Edt');

var logger = require('../logger').delegate('FilePacker');
class BaseFilePacker{
    constructor(serverId, version="*"){
        var packer = this.packer = new this.Packer();
        this.serverId = serverId;
        this.server = config.servers[serverId];
        this.version = version;
        this.table = packer.table;
        this.name = packer.name;
        this.initVersion();
        this.filePath = this.getFilePath(serverId, version);
        this.edtPacker = new EdtPacker();
    }
    initVersion(){
        var version = this.version;
        if(!version || version === '*'){
            this.version = config.findNewestVersion(this.serverId, this.packer.path, this.packer.file);
        }
    }
    getFilePath(){
        var packer = this.packer;

        var resourceDir, dataFilePath;
        dataFilePath = config.getResourcePath(this.serverId, this.version, packer.path, packer.file);
        resourceDir = this.resourceDir = path.dirname(dataFilePath);
        logger.info(this.name, "work directory", resourceDir);

        return dataFilePath;
    }
    unpack(data){
        data = this.edtPacker.unpack(data);
        fs.writeFileSync(path.join(config.samplesDir, 'source._edt'), data);
        return this.packer.unpack(data, this.server.encoding);
    }
    unpackFromFile(cb){
        fs.readFile(this.filePath, (err, data)=>{
            if(err){
                return cb(err);
            }
            cb(null, this.unpack(data));
        });
    }
    pack(elements){
        var data = this.packer.pack(elements, this.server.encoding);
        return this.edtPacker.pack(data);
    }
    packToFile(elements, filePath, cb){
        fs.writeFile(filePath, this.pack(elements), cb);
    }
}

Object.assign(BaseFilePacker.prototype, {
    Packer : require('../packers/CommonData')
});

module.exports = BaseFilePacker;