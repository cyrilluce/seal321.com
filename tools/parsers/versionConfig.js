var blockRegex = /\[([\s\S]+?)\]([^\[]*)/gi;
var propertyRegex = /(.*?)=([^\r\n]*)/gi;

/**
 * @param {String} version.ini的内容
 * @return {Object} versionData 含{String} curVersion与{Object[]} versions属性
 */
module.exports =  function(content){
    var versions = [];
    var curVersion;
    content.replace(blockRegex, function(str, blockHead, blockContent){
        var properties = {};
        blockContent.replace(propertyRegex, function(str, name, value){
            properties[name] = value;
        });
        if(blockHead === "DEFAULT"){
            curVersion = properties["CUR_VERSION"];
        }else{
            versions.push({
                version : blockHead.replace(/^VERSION /, ""),
                properties : properties
            });
        }
    });

    if(curVersion && versions.length>0){
        return {
            curVersion : curVersion,
            versions : versions
        };
    }else{
        return null; // 解析失败
    }
};