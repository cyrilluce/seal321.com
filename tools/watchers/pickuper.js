/**
 * TODO 自动监听source文件，并进行提取
 * 还有下一步，自动更新到服务器（deployer）
 * Created by cyrilluce on 2016/8/8.
 */
"use strict";
var Rx = require('rx'),
    path = require('path'),
    fs = require('fs'),
    yauzl = require('yauzl'),
    parseVersionNo = require('../parsers/versionNo');
const fileRegex = /^[a-z]+_[0-9.]+\.zip$/i;

const watch =  options => {
    options = options || {};

    var logger = require('../logger').delegate('提取器', options.name);

    // 提取器
    /*
    目前要提取的：
    数据（db），直接同步到服务器
    翻译/汉化，主要用于美服，item、monster、text、skill
    图片（物品、技能图标等），低优先级
     */
    var pickuper = new Rx.Subject();


    // 初始解压
    fs.readdir(options.src, function(err, files){
        if(!err){
            files.sort((a,b)=>a>b?-1:1).forEach(file=>{
                unpacker.onNext(file);
            })
        }
    });
    // 后续监听
    fs.watch(options.src, (event, filename) => {
        unpacker.onNext(filename);
    });

    return pickuper;
};