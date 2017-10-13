/**
 * Created by zhongxiaoming on 2017/9/4.
 */
/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permit_check_move_distance = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'permit_check_move_distance';
        this.description = '移动距离不能大于50米!';
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
            if (dis > 50) {
                // 如果两个形状点之间的距离小于2米则认为他俩重合;
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
            }
        }
        return [];
    }
});
