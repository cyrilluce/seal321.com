require("../../framework/cy");
Ext.ns("SF.util");

/**
 * 自动刷新任务对象，将相关逻辑都集中在组件内部，避免重复编码。

 * 注意，它视所有任务为异步的，即不是调用任务后开始下次计时，而是等待任务完成调用IntervalTask的finish后

 * 才开始计时。

 * 示例：

 * <pre><code>
var task = new SF.util.IntervalTask({
	fn : function(){
		Ext.Ajax.request({
			url : "php/delay.php",
			callback : function(){
				task.finish(); // 通知IntervalTask任务完成。很重要，否则会卡在这里不进行下次计时。

			}
		});
	},
	interval : 5000 // 执行间隔5秒

});
task.start();
 * </code></pre>
 * @class SF.util.IntervalTask
 */

Ext.util.IntervalTask = function (config) {
	var me = this;
	/**
	 * @cfg {Function} fn 需要定时执行的任务
	 * 任务结束时注意要调用{@link #finish}开始下次计时。

	 */
	this.fn = Ext.isFunction(config) ? config : config.fn;

	/**
	 * @cfg {Object} scope (optional) 任务方法的执行对象

	 */
	this.scope = config.scope || this;
	// this.intervalFn = fn.createDelegate(scope);
	/**
	 * @cfg {Number} interval (optional) 
	 * <p>任务执行间隔:任务执行完毕(this.finish())到开始下次执行的时间间隔，单位为毫秒</p>
	 * 默认为10秒

	 */
	this.intervalTime = config.interval || 10000;
	
	this.executed = false;

	// 执行的任务

	//this.task = new Ext.util.DelayedTask(this.fn, this.scope);
	this.taskFn = function () {
		clearInterval(me.taskId);
		me.taskId = null;
		me.fn.call(me.scope);
		me.executed = true;
	};
	this.bRunning = false;
};

Ext.util.IntervalTask.prototype = {
	// private
	delayTask : function (n) {
		this.cancelTask();
		this.executed = false;
		this.startTime = new Date();
		this.countDown = n;
		this.taskId = setInterval(this.taskFn, n);
	},
	// private
	cancelTask : function () {
		if (this.taskId) {
			clearInterval(this.taskId);
			this.taskId = null;
		}
	},
	// private
	// 自动调整当前任务(新设置的间隔短于当前剩余计时时)
	adjustRunningTask : function () {
		var n;
		if (this.bRunning && this.taskId) {
			n = this.countDown - (new Date() - this.startTime);
			// 如果新的间隔小于当前的剩余时间，重新计时
			if (n > this.intervalTime) {
				this.delayTask(this.intervalTime);
			}
		}
	},
	/**
	 * 开始自动任务

	 * @param {Number} newInterval (optional) 新的执行间隔(毫秒)
	 * @param {Boolean} skipFirst (optional) 是否跳过首次刷新(直接开始倒计时)，默认为false
	 */
	start : function (newInterval, skipFirst/* = false */) {
		this.setInterval(newInterval);
		if (!this.bRunning) {
			this.bRunning = true;
			this.delayTask(skipFirst === true ? this.intervalTime : 0);
		}
	},
	/**
	 * 停止自动任务
	 */
	stop : function () {
		if (this.bRunning) {
			this.bRunning = false;
			this.cancelTask();
		}
	},
	/**
	 * 设置新的执行间隔
	 * @param {Number} newInterval 新的执行间隔(毫秒)
	 * @param {Boolean} autoRecount (optional) 是否自动调整当前任务，默认为true
	 * 		(例如上次刷新还有50秒结束，这次设置10秒间隔，会自动将当前任务改为10秒后执行)
	 */
	setInterval : function (newInterval, autoRecount /* = true */) {
		autoRecount = (autoRecount !== false);
		if (Ext.isNumber(newInterval)) {
			this.intervalTime = newInterval;
			if (autoRecount) {
				this.adjustRunningTask();
			}
		}
	},
	/**
	 * 暂停刷新
	 * @param {Boolean} froze (optional) 是否冻结当前计时，默认为false
	 * 		冻结的意义是：上次还剩多长时间，下次恢复(resume)后还是多长时间

	 * 		如果不冻结，恢复时只要时间到了(不管中间是否有暂停)就执行。

	 */
	suspend : function (froze /* = false */) {
		if (this.bRunning) {
			this.bRunning = false;
			this.frozed = (froze === true);
			if (this.frozed) {
				this.frozeTime = new Date();
			}
			this.cancelTask();
		}
	},
	/**
	 * 恢复刷新
	 */
	resume : function () {
		var n = this.countDown;
		if (!this.bRunning) {
			this.bRunning = true;
			// 如果当初是froze，则从剩余时间开始计时

			if (this.frozed && this.startTime < this.frozeTime) {
				n -= (this.frozeTime - this.startTime);
			} else {
				// 否则直接与现在时间对比

				n -= (new Date() - this.startTime);
			}

			if (n < 0) {
				n = 0;
			}
			this.delayTask(n);
		}
	},
	/**
	 * 是否正在自动刷新
	 * @return {Boolean} isRunning
	 */
	running : function () {
		return !!this.bRunning;
	},
	/**
	 * 结束本次执行，进行下次计时。

	 * @param {Number} n (optional) 设定自定的下次执行间隔(毫秒)
	 */
	finish : function (n) {
		if (this.bRunning) {
			this.delayTask(this.intervalTime);
		}
	}
};