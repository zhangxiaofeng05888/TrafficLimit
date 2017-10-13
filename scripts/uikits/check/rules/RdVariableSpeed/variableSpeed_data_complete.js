/**
 * Created by zhaohang on 2017/3/27.
 */

fastmap.uikit.check.rule.rdVariableSpeed_data_complete = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'PERMIT_CHECK_IS_INTEGRITY_RDVARIBLESPEED';
        this.description = '可变限速信息不完整!';
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
