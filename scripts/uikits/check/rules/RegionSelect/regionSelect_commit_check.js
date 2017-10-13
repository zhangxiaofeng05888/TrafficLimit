/**
 * Created by liwanchong on 2017/6/7.
 */
/**
 * Created by zhaohang on 2017/3/28.
 */

fastmap.uikit.check.rule.regionSelect_commit_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'regionSelect_commit_check';
        this.description = '没有选择子任务,请选择子任务后提交!';
    },

    check: function (editResult) {
        if (editResult.idObj && editResult.idObj.subtaskId) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
