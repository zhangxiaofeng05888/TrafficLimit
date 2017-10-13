/**
 * Created by wangmingdong on 2017/8/4.
 */

fastmap.uikit.check.rule.linkSpeedLimit_complete = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'linkSpeedLimit_complete';
        this.description = '线限速关系不完整，无法创建！';
    },

    check: function (editResult) {
        if (editResult.inLink) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
