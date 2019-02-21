/**
 * 合并Reader和即将开发的Writer，它们放在一起比较好
 * @author cyrilluce
 * @date 2013-6-29
 */
var Base = require('../util').Base;
var iconv = require('iconv-lite');

var findStrEndIndex = function(buffer, offset, charSize){ // 只支持charSize為1或2
    offset = offset || 0;
    charSize = charSize || 1;
    var index = 0;
    while(offset + index<buffer.length && (buffer[offset + index]!==0 || (charSize>1 && buffer[offset + index + 1]!==0))){
        index+=charSize;
    }
    return index/charSize;
};

var logger = require('../logger').delegate('Packer');

var Packer = Base.extend({
    _basicEncoding : 'utf-8',
    _encoding : 'gbk',
    defaultType : 'int',
    TYPES : {
        "byte" : {
            read : function(config){
                var length = config.length || 1;
                var value = this.data.slice(this.offset, this.offset+length);
                this.offset += length;
                return value;
            },
            write : function(value, config){
                var data;
                if(!(value instanceof Buffer)){
                    value = new Buffer(value, 'ascii');
                }
                if(config.length){
                    data = new Buffer(config.length);
                    data.fill(0);
                    value.copy(data);
                }else{
                    data = value;
                }
                this.dest.concat(data);
            }
        },
        "uint" : {
            read : function(config){
                var length = config.length || 4;
                var value;
                switch(length){
                    case 1:
                        value = this.data.readUInt8(this.offset);
                        break;
                    case 2:
                        value = this.data.readUInt16LE(this.offset);
                        break;
                    case 4:
                        value = this.data.readUInt32LE(this.offset);
                        break;
                }
                this.offset += length;
                return value;
            },
            write : function(value, config){
                var length = config.length || 4;
                switch(length){
                    case 1:
                        this.dest.writeUInt8(value);
                        break;
                    case 2:
                        this.dest.writeUInt16LE(value);
                        break;
                    case 4:
                        this.dest.writeUInt32LE(value);
                        break;
                }
            }
        },
        "dwords" : {
            read : function(config){
                var values = [], index = 0, length = config.length;
                while(index < length){
                    values.push(this.data.readUInt32LE(this.offset + index));
                    index += 4;
                }
                if(index !== length){
                    logger.error("uints not mod 4!");
                }
                this.offset += length;
                return values;
            },
            write : function(value){
                var i;
                for(i=0; i<value.length; i++){
                    this.dest.writeUInt32LE(value[i]);
                }
            }
        },
        "int" : {
            read : function(config){
                var length = config.length || 4;
                var value;
                switch(length){
                    case 1:
                        value = this.data.readInt8(this.offset);
                        break;
                    case 2:
                        value = this.data.readInt16LE(this.offset);
                        break;
                    case 4:
                        value = this.data.readInt32LE(this.offset);
                        break;
                }
                this.offset += length;
                return value;
            },
            write : function(value, config){
                var length = config.length || 4;
                switch(length){
                    case 1:
                        this.dest.writeInt8(value);
                        break;
                    case 2:
                        this.dest.writeInt16LE(value);
                        break;
                    case 4:
                        this.dest.writeInt32LE(value);
                        break;
                }
            }
        },
        "float" : {
            read : function(config){
                var length = config.length || 4;
                var value;
                switch(length){
                    case 4:
                        value = this.data.readFloatLE(this.offset);
                        break;
                    case 8:
                        value = this.data.readDoubleLE(this.offset);
                        break;
                }
                this.offset += length;
                return value;
            },
            write : function(value, config){
                var length = config.length || 4;
                switch(length){
                    case 4:
                        this.dest.writeFloatLE(value);
                        break;
                    case 8:
                        this.dest.writeDoubleLE(value);
                        break;
                }
            }
        },
        // 代表  |length|chars 这种结构
        "string" : {
            read : function(config){
                var lengthSize, charSize;
                lengthSize = config.lengthSize || 4;
                charSize = config.charSize || 1;
                // 比较常见的是第一个DWORD指定长度
                var length = this.read('uint', { length:lengthSize });

                return this.read('fixedstring', {
                    length : length*charSize,
                    charSize : charSize,
                    noEncoding : config.noEncoding
                });
            },
            write : function(value, config){
                var lengthSize = config.lengthSize || 4,
                    charSize = config.charSize || 1;
                value = new Buffer(value);
                if(!config.noEncoding){
                    try{
                        value = this._getWriteIconv().convert(value);
                    }catch(e){
                        logger.error("try to convert string error:"+value.toString()+" "+this._encoding + "->" + this._basicEncoding);
                        value = new Buffer("[Seal321]convert string fail...");
                    }
                }
                var length = (value.length / charSize);//  || 1; // 不让出现为0的字串
                this.write('uint', length, { length:lengthSize });
                this.write('byte', value, {});
            }
        },
        // 代表 已知固定长度的字符串
        "fixedstring" : {
            read : function(config){
                var length = config.length,
                    charSize = config.charSize || 1;
                var value = this.data.slice(this.offset, this.offset+length);

                // 过滤 \0 后的字符，防止错误
                var endIndex = findStrEndIndex(value, 0, charSize);
                var buffer = new Buffer(endIndex*charSize);
                value.copy(buffer);
                value = buffer;

                if(!config.noEncoding){
                    try{
                        value = iconv.decode(value, this._basicEncoding);
                    }catch(e){
                        logger.error("try to convert string error:"+value.toString()+" "+this._encoding + "->" + this._basicEncoding);
                        value = new Buffer("[Seal321]convert string fail...");
                    }
                }
                this.offset += length;
                return value.toString();
            },
            write : function(value, config){ // 如果没有指定length，则按当前字串转码后的长度来计算
                value = new Buffer(value);
                if(!config.noEncoding){
                    try{
                        value = iconv.encode(value, this._encoding);
                    }catch(e){
                        logger.error("try to convert string error:"+value.toString()+" "+this._basicEncoding + "->" + this._encoding);
                        value = new Buffer("[Seal321]convert string fail...");
                    }
                }
                var length = config.length || value.length;
                var buffer = new Buffer(length);
                buffer.fill(0);
                value.copy(buffer);
                this.dest.concat(buffer);
            }
        },
        // 代表 以 \0 结尾的变长字符串
        "cstring" : {
            read : function(config){
                var charSize = config.charSize || 1;
                var charLength = findStrEndIndex(this.data, this.offset, charSize);
                var length = charLength * charSize;
                var value = this.read('fixedstring', {
                    length : length,
                    noEncoding : config.noEncoding
                });
                this.offset += charSize; // 去掉 \0 结束符
                return value;
            },
            write : function(value, config){
                var charSize = config.charSize || 1;
                this.write('fixedstring', value, {
                    noEncoding : config.noEncoding
                });
                this.write('uint', 0, {length : charSize}); // 写入 \0 结束符
            }
        },
        "array" : {
            read : function(config){
                var value = [], i, count;
                // 第一个DWORD指定长度
                count = this.read('uint', {length : 4}); //this.data.readUInt32LE(this.offset);
                //this.offset += 4;



                // 循环读取
                for(i=0; i<count; i++){
                    // extra中指定type及config
                    value.push(this.read(config.elementType, config.elementConfig));
                }

                return value;
            },
            write : function(value, config){
                // 第一个DWORD指定长度
                this.write('uint', value.length, {length : 4});
                var i;
                for(i=0; i<value.length; i++){
                    this.write(config.elementType, value[i], config.elementConfig);
                }
            }
        },
        "fixedarray" : {
            read : function(config){
                var value = [], i, count;
                count = config.length;
                //this.offset += 4;



                // 循环读取
                for(i=0; i<count; i++){
                    // extra中指定type及config
                    value.push(this.read(config.elementType, config.elementConfig));
                }

                return value;
            },
            write : function(value, config){
                var i;
                for(i=0; i<value.length; i++){
                    this.write(config.elementType, value[i], config.elementConfig);
                }
            }
        },
        "struct" : {
            read : function(config){
                var data = {};
                this.batchRead(config.properties, data);
                return data;
            },
            write : function(value, config){
                this.batchWrite(config.properties, value);
            }
        },
        "custom" : {
            read : function(config, data){
                return config.read.call(this, config, data);
            },
            write : function(value, config, data){
                return config.write.call(this, config, data);
            }
        },
        "fixed" : {
            read : function(config){
                return config.value;
            },
            write : function(value, config){
                
            }
        }
    },
    constructor : function(data, offset, encoding){
        this.setSourceBuffer(data, offset);
        this.setEncoding(encoding);
//			this.setDestinationBuffer(new BufferWriter());
    },
    /**
     * 设定字串的编码
     */
    setEncoding : function(encoding){
        if(encoding){
            this._encoding = encoding;
        }
    },
    /**
     * 用于读取时设定数据源
     */
    setSourceBuffer : function(buffer, offset){
        this.data = buffer;
        this.offset = offset || 0;
    },
    /**
     * 用于写入时设定输出地
     */
    setDestinationBuffer : function(bufferWriter){
        this.dest = bufferWriter;
    },
    getDestinationBuffer : function(){
        return this.dest;
    },
    isEof : function(){
        return this.offset >= this.data.length;
    },
    read : function(type, config, data){
        var typeDefines = this.TYPES[type || this.defaultType], value;
        if(typeDefines){
            value = typeDefines.read.call(this, config || {}, data);
//				logger.info("read",this.offset, type || this.defaultType, value);
            return value;
        }else{
            throw "unsupport read type of " + type;
        }
    },
    batchRead : function(properties, data){
        var i, o, name, type, config;
        data = data || {};
        for(i=0; i<properties.length; i++){
            o = properties[i];
            if(typeof o === "string"){
                name = o;
                type = null;
                config = null;
            }else{
                name = o.name;
                type = o.type;
                config = o;
            }
//				logger.info('----------',name);
            data[name] = this.read(type, config, data);
        }
        return data;
    },
    write : function(type, value, config, data){
        var typeDefines = this.TYPES[type || this.defaultType];
        if(typeDefines){
            //logger.info("read " + length + " " +type);
            return typeDefines.write.call(this, value, config || {}, data);
        }else{
            throw "unsupport read type of " + type;
        }
    },
    batchWrite : function(properties, data){
        var i, o, name, type, config;
//			logger.info(properties, data);
        for(i=0; i<properties.length; i++){
            o = properties[i];
            if(typeof o === "string"){
                name = o;
                type = null;
                config = null;
            }else{
                name = o.name;
                type = o.type;
                config = o;
            }
//				logger.info(type, data[name], config);
            this.write(type, data[name], config, data);
        }
    }
});

module.exports = Packer;
//});