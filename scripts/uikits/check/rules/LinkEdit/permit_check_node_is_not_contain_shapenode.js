/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permit_check_node_is_not_contain_shapenode = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'permit_check_node_is_not_contain_shapenode';
        this.description = '形状点和形状点间不能小于2米!';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        var linkGeo = this.geometryAlgorithm.precisionGeometry(editResult.finalGeometry, 5).coordinates;
        if (linkGeo.length < 2) {
            return [];
        }
        for (var i = 0; i < linkGeo.length - 1; i++) {
            var prePoint = this.uikitUtil.createPoint([linkGeo[i][0], linkGeo[i][1]]);
            var postPoint = this.uikitUtil.createPoint([linkGeo[i + 1][0], linkGeo[i + 1][1]]);
            var dis = this.geometryAlgorithm.sphericalDistance(prePoint, postPoint);
            if (dis < 2) {
                // 如果两个形状点之间的距离小于2米则认为他俩重合;
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }
        return [];
    }
});
