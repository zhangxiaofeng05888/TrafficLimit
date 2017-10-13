/**
 * Created by zhaohang on 2017/7/4.
 */
fastmap.uikit.check.rule.self_intersection_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'self_intersection_check';
        this.description = '所选择的线存在自相交，请重新选择！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';

        if (editResult.parts) {
            for (var i = 0; i < editResult.parts.length; i++) {
                var linkId = editResult.parts[i].feature.properties.id;
                for (var j = i + 1; j < editResult.parts.length; j++) {
                    if (linkId === editResult.parts[j].feature.properties.id) {
                        return [result];
                    }
                }
            }
        }
        return [];
    }
});
