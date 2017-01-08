// 将big5文件转换
var Iconv = require("iconv").Iconv;
var iconv = new Iconv('CP950', 'utf-8'+'//IGNORE//TRANSLIT');

let fs = require('fs');

const path = `F:\\seal-samples\\_taiwan.edt.0.680.txt`;
fs.readFile(path, (err, data)=>{
    if(err){
        throw err;
    }
    fs.writeFile(path+'.converted', iconv.convert(data));
})