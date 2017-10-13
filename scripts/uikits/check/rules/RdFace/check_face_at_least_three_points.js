/**
 * Created by 79358 on 2017/5/23.
 */
fastmap.uikit.check.rule.check_face_at_least_three_points = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'check_face_at_least_three_points';
        this.description = 'LineString至少拥有三个坐标点才能闭合';
    },

    check: function (editResult) {
        if (editResult.finalGeometry) {
            if (editResult.finalGeometry.coordinates.length > 2) {
                return [];
            }

            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'precheck';
            return [result];
        }
        return [];
    }
});
