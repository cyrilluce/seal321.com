/**
 * Created by cyrilluce on 2016/11/30.
 */
var fs = require('fs'),
    path = require('path');

const root = './';
fs.readdir(root, (err, files)=>{
    files.forEach(file=>{
        if(!/^_.*\.png$/.test(file)){
            return;
        }
        fs.rename(path.join(root, file), path.join(root, file.slice(1)), err=>{
            console.log('rename', file, 'done');
        })
    })
})