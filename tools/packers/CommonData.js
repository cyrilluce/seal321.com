/**
 * Created by cyrilluce on 2016/8/7.
 */
var Base = require('../util').Base;
var BinPacker = require('./Bin');
var BufferWriter = require("../components/BufferWriter");

var logger = require('../logger').delegate('Packer');

module.exports = Base.extend({
    name : 'common(to be override)',
    path : 'etc',
    file : 'to be override',
    indexAsId : false,
    // headerProperties : [],
    // 基本都长一个样
    headerProperties : [
        {
            name : "name",
            type : "fixedstring",
            length : 0x40
        },
        "count"
    ],
    getProperties : function(header){
        header = header || this._lastHeader;
        var propertiesMap = this.propertiesMap, properties;

        if(propertiesMap){
            if(header.name in propertiesMap){
                properties = propertiesMap[header.name];
            }else{
                logger.error(this.name, '未找到结构定义', header.name);
            }
        }else{
            properties = this.properties;
        }
        return properties;
    },
    /**
     * 打包
     * @param {Object[]} elements
     * @param {String} encoding
     * @returns {Buffer} data
     */
    pack : function(elements, encoding){
        var writer = new BinPacker();
        writer.setEncoding(encoding);
        var bufferWriter = new BufferWriter();
        writer.setDestinationBuffer(bufferWriter);

        var header = Object.assign({}, this._lastHeader);
        header.count = elements.length;

        if(this.splittedFile && this._lastWroteHeader){
            // 已经写过头了，不再写入
        }else{
            writer.batchWrite(this.headerProperties, header);
            this._lastWroteHeader = header;
        }

        var properties = this.getProperties(header);

        elements.forEach(element=>{
            writer.batchWrite(properties, element);
        });

        return bufferWriter.getBuffer();
    },
    /**
     * 解包
     * @param {Buffer} data
     * @param {String} encoding
     * @param {Function} [callback]
     * @returns {Array} elements
     */
    unpack : function(data, encoding, callback){
        var reader = new BinPacker(data, 0, encoding);
        // 读过header的，跳过
        var header;
        if(this.splittedFile && this._lastHeader){
            header = this._lastHeader;
        }else{
            header = this._lastHeader = reader.batchRead(this.headerProperties);
        }
        var elements = [], element, index = 0;
        var properties = this.getProperties(header);

        while(true || elements.length<header.count){ // 不依赖count算了，有些文件没按这个来
            if(reader.isEof()){
                break
            }
            element = reader.batchRead(properties);
            if(this.indexAsId){
                element.id = index;
            }

            if(callback){
                callback(element, index);
            }else{
                elements.push(element);
            }
            index++;
        }

        return elements;
    }
});