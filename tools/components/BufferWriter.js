/**
 * 动态Buffer
 * @author cyrilluce
 * @date 2013-6-29
 */
//define(function(require){
	var DynamicBuffer = require('./DynamicBuffer');
	var BufferWriter = require('../util').extend(DynamicBuffer, {
		_ensureSize : function(_additionalDataSize){
			var neededSize = this.length + _additionalDataSize;
			if (this.buffer.length < neededSize)
			{
				var oldBuffer = this.buffer;
				/* other possibility: take the current buffer length and multiply
				 * it with resizeFactor until it is large enough
				 */
				this.buffer = Buffer.from(~~(neededSize * this.resizeFactor));
				oldBuffer.copy(this.buffer);
			}
		}
	});
	
	var proto = BufferWriter.prototype,
		superProto = DynamicBuffer.prototype;
	var fns = {
			"UInt8" : 1,
			"UInt16LE" : 2,
			"UInt16BE" : 2,
			"UInt32LE" : 4,
			"UInt32BE" : 4,
			"Int8" : 1,
			"Int16LE" : 2,
			"Int16BE" : 2,
			"Int32LE" : 4,
			"Int32BE" : 4,
			"FloatLE" : 4,
			"FloatBE" : 4,
			"DoubleLE" : 8,
			"DoubleBE" : 8
		}, name, fnName, length;
	var createDelegate = function(fnName, length){
		return function(value, offset, noAssert){
			this._ensureSize(length);
			this.buffer[fnName](value, this.length, noAssert);
			this.length += length;
			return this;
		};
	};
	for(name in fns){
		if(fns.hasOwnProperty(name)){
			length = fns[name];
			fnName = 'write'+name;
			proto[fnName] = createDelegate(fnName, length);
		}
	}
	
	proto.writeByte = superProto.write;
	proto.write = superProto.append;
	
	module.exports = BufferWriter;
//});