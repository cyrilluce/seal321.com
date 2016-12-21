/**
 * Created by cyrilluce on 2016/8/7.
 */
var Base = exports.Base = function Base(){};
Base.extend = function(overrides) {
    var sp = this;
    var oc = Object.prototype.constructor;
    var sb = overrides.constructor != oc
        ? overrides.constructor
        : function() {
        sp.apply(this, arguments);
    };

    var F = function() {
    }, sbp, spp = sp.prototype;

    F.prototype = spp;
    sbp = sb.prototype = new F();
    sbp.constructor = sb;
    sb.__super__ = spp;
    if (spp.constructor == oc) {
        spp.constructor = sp;
    }
    Object.assign(sbp, overrides);
    sb.extend = Base.extend;
    return sb;
};

exports.extend = function() {
    // inline overrides
    var io = function(o) {
        for (var m in o) {
            this[m] = o[m];
        }
    };
    var oc = Object.prototype.constructor;

    return function(sb, sp, overrides) {
        if (typeof sp === 'object') {
            overrides = sp;
            sp = sb;
            sb = overrides.constructor != oc
                ? overrides.constructor
                : function() {
                sp.apply(this, arguments);
            };
        }
        var F = function() {
        }, sbp, spp = sp.prototype;

        F.prototype = spp;
        sbp = sb.prototype = new F();
        sbp.constructor = sb;
        sb.superclass = spp;
        if (spp.constructor == oc) {
            spp.constructor = sp;
        }

        sbp.superclass = sbp.supr = (function() {
            return spp;
        });
        sbp.override = io;
        Object.assign(sb, overrides);
        sb.extend = function(o) {
            return exports.extend(sb, o);
        };
        return sb;
    };
}();