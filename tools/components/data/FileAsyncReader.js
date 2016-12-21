require("../../framework/cy");
var fs = require("fs");
module.exports = Ext.extend(Object, {
	reading : false,
	file : "asyncReader.tmp",
	constructor : function(cfg){
		Ext.apply(this, cfg);
		this.callbacks = [];
		this.reading = false;
	},
	read : function(callback, scope){
		var cbs = this.callbacks, me = this;
		cbs.push({
			fn : callback,
			scope : scope
		});
		if(!this.reading){
			this.reading = true;
			//console.log("[Ext.data.FileAsyncReader] start read "+this.file);
			fs.readFile(this.file, function(err, data){
				//console.log("[Ext.data.FileAsyncReader] read api finish");
				if(err){
					//console.log("[Ext.data.FileAsyncReader] async read file [" + me.file + "] error: "+err);
					data = undefined;
				}
				var cb;
				while(cb = cbs.shift()){
					cb.fn.call(cb.scope, data);
				}
				me.reading = false;
			});
		}
	}
});