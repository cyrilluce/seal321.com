var Base = require('../util').Base;

var SealUtil = require("../addons/build/Release/SealUtil");

module.exports = Base.extend({
    CUSTOM_KEY_SIGN : 0xc8c8c8c8,
    /**
     * @param {Buffer} data
     * @param {Object} key 有imul, add, orig三個數字屬性，不指定時則為舊的加密方式
     * @return {Buffer} encryptedData
     */
    pack : function(data, key){
        key = key || this._lastKey;
        var buffer, encrypted;
        if(key && (key.imul || key.add || key.orig)){
            encrypted = SealUtil.encrypt(data, key.imul, key.add, key.orig);
            buffer = Buffer.from(encrypted.length + 0x10);
            buffer.writeUInt32LE(this.CUSTOM_KEY_SIGN, 0);
            buffer.writeUInt32LE(key.imul, 0x4);
            buffer.writeUInt32LE(key.add, 0x8);
            buffer.writeUInt32LE(key.orig, 0xc);
            encrypted.copy(buffer, 0x10);
            return buffer;
        }else{
            return SealUtil.encrypt(data);
        }
    },
    /**
     * @param {Buffer} encryptedData
     * @return {Buffer} data
     */
    unpack : function(data, key){
        var sign = data.readUInt32LE(0);
        if(sign === this.CUSTOM_KEY_SIGN){
            key = key || {}; // 为了兼容，直接修改传入的参数...
            key.imul = data.readUInt32LE(4);
            key.add = data.readUInt32LE(8);
            key.orig = data.readUInt32LE(0xc);
            this._lastKey = key;
            return SealUtil.decrypt(data.slice(16),key.imul, key.add, key.orig);
        }
        this._lastKey = null;
        return SealUtil.decrypt(data);
    }
});