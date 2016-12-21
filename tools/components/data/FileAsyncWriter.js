require("../../framework/cy");
var fs = require("fs");
module.exports = Ext.extend(Object, {
	writing : false,
	file : "asyncReader.tmp",
	constructor : function(cfg){
		Ext.apply(this, cfg);
		this.callbacks = [];
		this.writing = false;
	},
	write : function(data, callback, scope){
		var cbs = this.callbacks, me = this;
		if(callback){
			cbs.push({
				fn : callback,
				scope : scope
			});
		}
		if(!this.writing){
			this.writing = true;
			cbs = cbs.slice(0);
			//console.log("[Ext.data.FileAsyncWriter] call api write: "+this.file);
			fs.writeFile(this.file, data, function(err){
				if(err){
					//console.log("[Ext.data.FileAsyncWriter] async write file [" + this.file + "] error: "+err);
				}
				var cb, value;
				while(cb = cbs.shift()){
					cb.fn.call(cb.scope);
				}
				me.writing = false;
				value = me.waitingData;
				if(value){
					//console.log("[Ext.data.FileAsyncWriter] has waiting data, recursive call");
					me.waitingData = null;
					me.write(value);
				}
			});
		}else{
			//console.log("[Ext.data.FileAsyncWriter] writing, wait");
			this.waitingData = data;
		}
	}
});