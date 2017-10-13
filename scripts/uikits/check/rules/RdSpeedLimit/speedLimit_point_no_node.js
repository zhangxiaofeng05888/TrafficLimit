/**
 * Created by 王明东 on 2017/7/21.
 */

fastmap.uikit.check.rule.speedLimit_point_no_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'speedLimit_point_no_node';
        this.description = '点限速位置不能制作到关联link端点';
    },

    check: function (editResult) {
        if (!editResult.link) {
            return [];
        }
        if (editResult.link) {
            if (!editResult.point) {
                return [];
            }
            if (editResult.point.coordinates.toString() != editResult.link.geometry.coordinates[0].toString() && editResult.point.coordinates.toString() != editResult.link.geometry.coordinates[editResult.link.geometry.coordinates.length - 1].toString()) {
                return [];
            }
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
