/**
 * Created by zhaohang on 2017/7/11.
 */
fastmap.uikit.check.rule.drawPolygon_not_intersect = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'drawPolygon_not_intersect';
        this.description = '绘制的质检面不能自相交！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        var geometry = {
            type: 'Polygon',
            coordinates: [editResult.finalGeometry.coordinates]
        };

        if (!this.geometryAlgorithm.isSimple(geometry)) {
            return [result];
        }
        return [];
    }
});
