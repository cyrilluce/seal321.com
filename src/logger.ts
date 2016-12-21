type Log = (...args: any[]) => void;
interface Logger{
    debug: Log;
    info: Log;
    wain : Log;
    error : Log;
}


var tracer = require('tracer');
var fs = require('fs');
var logConfig = process.argv[2];

// 不再使用原生的dailyfile，现在需要的是debug里包含info、warn、error日志
var levels = ['debug', 'info', 'warn', 'error'],
    levelIndexMap = {},
    targetsMap = {};
levels.forEach(function(level, index){
    targetsMap[level] = levels.slice(0, index+1);
    levelIndexMap[level] = index;
});
var makeTransport = function(conf) {
    var _conf = conf;

    function LogFile(prefix, date) {
        this.date = date;
        this.prefix = prefix;
        this.path = _conf.root+'/'+prefix+'.'+date+'.log';
        this.stream = fs.createWriteStream(this.path, {
            flags: "a",
            encoding: "utf8",
            mode: 0o666
        });
    }

    LogFile.prototype.write = function(str) {
        this.stream.write(str+"\n");
    };

    LogFile.prototype.destroy = function() {
        if (this.stream) {
            this.stream.end();
            this.stream.destroySoon();
            this.stream = null;
        }
    };

    var _logMap = {};

    function _push2File(str, title) {
        var logFile = _logMap[title], now = new Date(), date = ''+now.getFullYear(), month, day;
        month = now.getMonth()+1;
        date += (month<10 ? '0' : '')+month;
        day = now.getDate();
        date += (day<10 ? '0' : '')+day;
        if(logFile && logFile.date !== date) {
            logFile.destroy();
            logFile = null;
        }
        if(!logFile){
            logFile = _logMap[title] = new LogFile(title, date);
        }
        logFile.write(str);
    }

    return function(data) {
        var level = data.title;
        var targets = targetsMap[level] || [level], i;
        var levelIndex = levelIndexMap[level] || 0;
        for(i=0; i<targets.length; i++){
            // 在info下，不输出debug文件
            if(levelIndexMap[targets[i]] < levelIndex){
                continue;
            }
            _push2File(data.output, targets[i]);
            console.log(data.output, targets[i]);
        }
    };
};

var isDev = logConfig === 'dev';
var config = {
	format : "{{timestamp}} <{{title}}> {{message}}  ({{file}}:{{line}})",
	dateformat : "HH:MM:ss.L",
    transport: undefined
};
if(!isDev){
	config.transport = makeTransport({
        root : __dirname+'/../logs'
    });
}
var logger: Logger = isDev ? tracer.colorConsole(config) : tracer.console(config);
var backups = {};
var noop = function(){};

function checkDebugFlag(level?: string){
	level = level || 'debug';
	fs.exists(__dirname+'/'+level, function(exists){
		var backupMethod = backups[level];
		if(exists){// 如果存在flag，则表示开启
            if(backupMethod && logger[level] === noop){
                logger[level] = backupMethod;
                logger[level]('开启输出');
            }
		}else{ // 如果不存在flag，则表明关闭此等级输入
            if(!backupMethod){
                backupMethod = backups[level] = logger[level];
            }
            if(logger[level] !== noop){
                backupMethod('关闭输出');
                logger[level] = noop;
            }
		}
	});
}
checkDebugFlag();
setInterval(function(){
    checkDebugFlag();
}, 60*1000);

export default logger;