require("../../framework/cy");
(function(){
	var fs = require("fs");
	var FileAsyncReader = require("./FileAsyncReader");
	var FileAsyncWriter = require("./FileAsyncWriter");
	var Provider = Ext.extend(Object, {
		file : "state.tmp",
		defaultValue : {},
		isReady : false,
		constructor : function(cfg){
			Ext.apply(this, cfg);
			this.isReady = false;
			this.data = {};
			this.reader = new FileAsyncReader({
				file : this.file
			});
			this.writer = new FileAsyncWriter({
				file : this.file
			});
			this.readState(function(data){
				console.log("[SF.data.StateProvider] read state: "+JSON.stringify(data));
				this.data = data;
				this.isReady = true;
				if(this.onReady){
					this.onReady.call(this.scope, data);
				}
			}, this);
		},
		get : function(key){
			if(!this.isReady){
				throw "[SF.data.StateProvider] not ready yet!";
			}
			if(key){
				return this.data[key];
			}
			return this.data;
		},
		readState : function(callback, scope){
			this.reader.read(function(data){
				console.log("[SF.data.StateProvider] readState finish");
				var value;
				if(data){
					try{
						value = JSON.parse(data.toString());
					}catch(e){
						console.log("[SF.data.StateProvider] JSON.parse err: "+data.toString());
					}
				}
				value = value || this.defaultValue;
				console.log("[SF.data.StateProvider] defaultValue: "+JSON.stringify(this.defaultValue));
				callback.call(scope, value);
			}, this);
		},
		set : function(key, value, callback, scope){
			if(Ext.isObject(key)){
				scope = callback;
				callback = value;
				this.data = key || {};
			}else{
				this.data[key] = value;
			}
			this.writer.write(new Buffer(JSON.stringify(this.data)), callback, scope);
		}
	});
	module.exports = Provider;
})()