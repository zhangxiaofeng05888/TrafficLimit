/**
 * Created by linglong on 2017/9/6.
 */

fastmap.uikit.check.rule.link_node_is_not_closed_on_add_rdgsc = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);
        this.id = 'link_node_is_not_closed_on_add_rdgsc';
        this.description = '相邻形状点/NODE不可过近，不能小于2m';
    },

    check: function (editResult) {
        if (!editResult.point || !editResult.parts.length) {
            return [];
        }
        // snapLink几何;
        var pointGeo = this.geometryAlgorithm.precisionGeometry(editResult.point, 5).coordinates;
        for (var i = 0; i < editResult.parts.length; i++) {
            var partGeo = editResult.parts[i].feature.geometry;
            var linkGeo = this.geometryAlgorithm.precisionGeometry(partGeo, 5).coordinates;
            if (this.checkDistance(linkGeo, pointGeo)) {
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
            }
        }
        return [];
    },

    checkDistance: function (linkGeo, pointGeo) {
        for (var i = 0; i < linkGeo.length; i++) {
            var pointInLink = this.uikitUtil.createPoint([linkGeo[i][0], linkGeo[i][1]]);
            var PointOnAdd = this.uikitUtil.createPoint([pointGeo[0], pointGeo[1]]);
            var dis = this.geometryAlgorithm.sphericalDistance(pointInLink, PointOnAdd);
            if (dis < 2 && dis) {
                return true;
            }
        }
        return false;
    }
});
