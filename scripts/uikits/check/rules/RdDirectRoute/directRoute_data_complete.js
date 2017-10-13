/**
 * Created by zhaohang on 2017/3/28.
 */

fastmap.uikit.check.rule.rdDirectRoute_data_complete = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdDirectRoute_data_complete';
        this.description = '顺行信息不完整!';
    },

    check: function (editResult) {
        if (editResult.inLink && editResult.inNode && editResult.outLink) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
