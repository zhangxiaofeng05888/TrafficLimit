/**
 * Created by wangmingdong on 2017/8/4.
 */

fastmap.uikit.check.rule.mileagePile_point_complete = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'mileagePile_point_complete';
        this.description = '里程桩关系不完整，无法创建！';
    },

    check: function (editResult) {
        if (editResult.link && editResult.point) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
