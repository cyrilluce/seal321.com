/**
 * Created by cyrilluce on 2016/8/7.
 */
var Base = require('./CommonData');
var BinPacker = require('./Bin');
var BufferWriter = require("../components/BufferWriter");

var logger = require('../logger').delegate('Packer');

module.exports = Base.extend({
    headerStructure : [
        {
            name : "name",
            type : "fixedstring",
            length : 0x14
        },
        { // 固定 0x100
            name : "res1",
            type : "uint",
            length : 0x4
        },
        {
            name : "fileNum",
            type : "uint",
            length : 0x4
        },
        { // 算上Amos的EdpHead，及所有文件大小总合
            name : "length",
            type : "uint",
            length : 0x4
        },
        {
            name : "res2",
            type : "byte",
            length : 0x20
        }
    ],
    subHeaderStructure : [
        {
            name : "index",
            type : "uint",
            length : 0x4
        },
        {
            name : "name",
            type : "fixedstring",
            length : 0x28
        },
        {
            name : "begin",
            type : "uint",
            length : 0x4
        },
        { // 0
            name : "res1",
            type : "uint",
            length : 4
        },
        {
            name : "length",
            type : "uint",
            length : 4
        },
        { // 与length相同
            name : "res2",
            type : "uint",
            length : 4
        },
        {
            name : "res3",
            type : "uint",
            length : 4
        }
    ],

    /**
     * @param {Object[]} files 需要包裝的文件列表，每個文件為對象，有name與data屬性，分別代表文件名與文件內容。
     *  其中data為Buffer類型
     * @return {Buffer} data
     */
    pack : function(files, encoding){
        var headerBuffer = new BufferWriter(),
            menuBuffer = new BufferWriter(),
            fileListBuffer = new BufferWriter();

        var headerWriter = new BinPacker(), header;
        headerWriter.setEncoding(encoding);
        headerWriter.setDestinationBuffer(headerBuffer);

        var indexWriter = new BinPacker();
        indexWriter.setEncoding(encoding);
        indexWriter.setDestinationBuffer(menuBuffer);

        var fileListWriter = new BinPacker();
        fileListWriter.setEncoding(encoding);
        fileListWriter.setDestinationBuffer(fileListBuffer);

        var headerLength = 0, fileTotalAlignedSize = 0;
        this.headerStructure.forEach(function(o){
            if(typeof o === 'object'){
                headerLength += o.length;
            }else{
                headerLength += 4;
            }
        });
        files.forEach((file, index)=>{
            var size = file.data.length;
            var alignedSize = size + (4 - size % 4) % 4;
            fileTotalAlignedSize += alignedSize;

            var fileHeader = {
                index : index,
                name : file.name,
                begin : fileListBuffer.length,
                res1 : 0x0,
                length : size,
                res2 : size,
                res3 : 0x0
            };
            indexWriter.batchWrite(this.subHeaderStructure, fileHeader);
            fileListBuffer.concat(file.data);
            // 4字节对齐
            var zeroPadBuffer = new Buffer(alignedSize - size);
            zeroPadBuffer.fill(0);
//				console.log(fileListBuffer.length, zeroPadBuffer.length);
            fileListBuffer.concat(zeroPadBuffer);
        });
        var headerRes2 = new Buffer(0x20);
        headerRes2.fill(0);
        header = {
            name : "Amos Resource File;",
            res1 : 0x100,
            fileNum : files.length,
            length : headerLength + fileTotalAlignedSize,
            res2 : headerRes2
        };
        headerWriter.batchWrite(this.headerStructure, header);

        return headerBuffer.concat(menuBuffer).concat(fileListBuffer).getBuffer();
    },
    /**
     * @param {Buffer} data
     * @return {Object[]} files
     */
    unpack : function(data, encoding){
        var files = [];

        var reader = new BinPacker(data, 0, encoding);
        var header = reader.batchRead(this.headerStructure);


        var subHeaders = [], i;
        for(i=0; i<header.fileNum; i++){
            subHeaders.push(reader.batchRead(this.subHeaderStructure));
        }
        subHeaders.forEach(function(subHeader){
            var file = {};
            file.name = subHeader.name;
            file.data = data.slice(reader.offset+subHeader.begin, reader.offset+subHeader.begin+subHeader.length);
            files.push(file);
        });

        return files;
    }
});