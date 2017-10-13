/**
 * Created by zhaohang on 2017/7/11.
 */
fastmap.uikit.check.rule.merge_subTask_num = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'merge_subTask_num';
        this.description = '需要选择两个子任务面进行合并！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';

        if (editResult.selectSubTaskIds.length !== 2) {
            return [result];
        }
        return [];
    }
});
