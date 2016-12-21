/**
 * Created by cyrilluce on 2016/8/7.
 */
"use strict";
var Base = require('./Base');

class SetOptPacker extends Base{}

Object.assign(SetOptPacker.prototype, {
    Packer : require('../packers/Craft')
});

module.exports = SetOptPacker;