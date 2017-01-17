"use strict";
/**
 * Created by cyrilluce on 2016/8/7.
 */
var mysql = require('mysql');
var base = module.exports = {
    // key : [], // 主键 ['id']
    // indexes : [], // 索引（包含联合索引 [ ['quest_id', 'node_id'] ]
    // fulltext : [], // 全文索引 [ 'name' ]
    extend : props=>Object.assign(Object.assign({}, base), props),
    getProperties : function(){
        var properties = this.properties;

        return properties.map(property=>{
            if(typeof property === 'string'){
                return {
                    name : property,
                    type : 'int'
                };
            }
            return property;
        });
    },
    getFields : function(){
        return this.properties.map(property=>property.name || property);
    },
    getFieldsSql : function(){
        var properties = this.getProperties();

        return properties.map(property=>{
            var type;
            switch(property.type){
                case 'float':
                    type = 'DOUBLE';
                    break;
                case 'string':
                case 'fixedstring':
                    type = 'VARCHAR('+(property.max || 255)+')';
                    break;
                // case 'int':
                default:
                    type = 'INT';
                    break;
            }
            var field = mysql.escapeId(property.name);
            var autoIncrement = property.autoIncrement ? ' AUTO_INCREMENT PRIMARY KEY' : ''
            return `${field} ${type} ${autoIncrement}`;
        }).join(',');
    },
    getIndexesSql : function(){
        var sqls = [];
        if(this.key){
            var keys = [].concat(this.key);
            var fieldsSql = keys.map(key=>mysql.escapeId(key)).join(',');
            sqls.push(`ADD PRIMARY KEY ( ${fieldsSql} )`);
        }
        if(this.indexes){
            var indexes = [].concat(this.indexes);
            indexes.forEach(indexFields=>{
                indexFields = [].concat(indexFields);
                var fieldsSql = indexFields.map(key=>mysql.escapeId(key)).join(',');
                sqls.push(`ADD INDEX ( ${fieldsSql} )`);
            })
        }
        if(this.fulltext){
            var fulltexts = [].concat(this.fulltext);
            fulltexts.forEach(fulltextField=>{
                var fieldSql = mysql.escapeId(fulltextField);
                sqls.push(`ADD FULLTEXT ( ${fieldSql} )`);
            })
        }
        return sqls.join(',');
    }
};