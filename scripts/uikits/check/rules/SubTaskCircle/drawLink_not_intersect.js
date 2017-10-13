/**
 * Created by zhaohang on 2017/7/11.
 */
fastmap.uikit.check.rule.drawLink_not_intersect = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'drawLink_not_intersect';
        this.description = '绘制的link不能自相交！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';

        if (!this.geometryAlgorithm.isSimple(editResult.finalGeometry)) {
            return [result];
        }
        return [];
    }
});
