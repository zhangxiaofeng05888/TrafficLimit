/**
 * Created by linglong on 2017/9/6.
 */
fastmap.uikit.check.rule.link_node_is_not_closed_on_add_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);
        this.id = 'link_node_is_not_closed_on_add_node';
        this.description = '相邻形状点/NODE不可过近，不能小于2m';
    },

    check: function (editResult) {
        if (editResult.type != 'PointAddResult') {
            return [];
        }
        if (!editResult.finalGeometry || !editResult.linkGeometry) {
            return [];
        }
        // snapLink几何;
        var linkGeo = this.geometryAlgorithm.precisionGeometry(editResult.linkGeometry, 5).coordinates;
        var pointGeo = this.geometryAlgorithm.precisionGeometry(editResult.finalGeometry, 5).coordinates;

        for (var i = 0; i < linkGeo.length; i++) {
            var pointInLink = this.uikitUtil.createPoint([linkGeo[i][0], linkGeo[i][1]]);
            var PointOnAdd = this.uikitUtil.createPoint([pointGeo[0], pointGeo[1]]);
            var dis = this.geometryAlgorithm.sphericalDistance(pointInLink, PointOnAdd);
            if (dis < 2) {
                // 如果两个形状点之间的距离小于2米则认为他俩重合;
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }
        return [];
    }
});
