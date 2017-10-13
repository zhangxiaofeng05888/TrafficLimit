/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.rdgsc_integrity_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'PERMIT_CHECK_IS_INTEGERITY_GSC';
        this.description = '未选择要制作立交的要素，请检查';
    },

    check: function (editResult) {
        if (editResult.parts.length > 0) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
