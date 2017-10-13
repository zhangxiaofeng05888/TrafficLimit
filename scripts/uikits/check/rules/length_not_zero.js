/**
 * Created by zhaohang on 2017/7/4.
 */
fastmap.uikit.check.rule.length_not_zero = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'length_not_zero';
        this.description = '线长度为0,无法创建Tips';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';

        if (editResult.finalGeometry) {
            if (editResult.finalGeometry.coordinates.length === 1) {
                return [result];
            }
            if (this.geometryAlgorithm.getLength(editResult.finalGeometry) === 0) {
                return [result];
            }
        }
        return [];
    }
});
