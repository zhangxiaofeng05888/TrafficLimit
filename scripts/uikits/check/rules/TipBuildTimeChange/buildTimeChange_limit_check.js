/**
 * Created by zhaohang on 2017/8/8.
 */
fastmap.uikit.check.rule.buildTimeChange_limit_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'buildTimeChange_limit_check';
        this.description = '存在非在建属性link或测线，无法保存！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        if (!editResult.startData || !editResult.endData) {
            return [];
        }
        var vias = editResult.vias;
        var startLink = editResult.startData.linkData;
        var endLink = editResult.endData.linkData;
        if (startLink.type === 'feature') {
            if (startLink.properties.limit.split(';').indexOf('10') < 0) {
                return [result];
            }
        } else {
            if (startLink.properties.cons !== 1) {
                return [result];
            }
        }
        if (endLink.type === 'feature') {
            if (endLink.properties.limit.split(';').indexOf('10') < 0) {
                return [result];
            }
        } else {
            if (endLink.properties.cons !== 1) {
                return [result];
            }
        }
        for (var i = 0; i < vias.length; i++) {
            if (vias[i].type === 'feature') {
                if (vias[i].properties.limit.split(';').indexOf('10') < 0) {
                    return [result];
                }
            } else {
                if (vias[i].properties.cons !== 1) {
                    return [result];
                }
            }
        }
        return [];
    }
});
