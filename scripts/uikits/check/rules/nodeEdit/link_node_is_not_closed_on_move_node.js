/**
 * Created by linglong on 2017/9/6.
 */
fastmap.uikit.check.rule.link_node_is_not_closed_on_move_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);
        this.id = 'link_node_is_not_closed_on_move_node';
        this.description = '相邻形状点/NODE不可过近，不能小于2m';
    },

    check: function (editResult) {
        if (editResult.type != 'PointMoveResult') {
            return [];
        }
        if (!editResult.finalGeometry || !editResult.topoLinks.length) {
            return [];
        }
        for (var i = 0; i < editResult.topoLinks.length; i++) {
            var linkGeo = this.geometryAlgorithm.precisionGeometry(editResult.topoLinks[i].geometry, 5).coordinates;
            if (this.checkDistance(linkGeo)) {
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }
        return [];
    },

    checkDistance: function (linkGeo) {
        for (var i = 0; i < linkGeo.length - 1; i++) {
            var prePoint = this.uikitUtil.createPoint([linkGeo[i][0], linkGeo[i][1]]);
            var postPoint = this.uikitUtil.createPoint([linkGeo[i + 1][0], linkGeo[i + 1][1]]);
            var dis = this.geometryAlgorithm.sphericalDistance(prePoint, postPoint);
            if (dis < 2) {
                return true;
            }
        }
        return false;
    }
});
