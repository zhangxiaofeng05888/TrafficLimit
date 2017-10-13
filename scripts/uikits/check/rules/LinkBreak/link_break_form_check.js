/**
 * Created by wuzhen on 2017/7/4.
 */

fastmap.uikit.check.rule.link_break_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'LINK_BREAK_FORM_CHECK';
        this.description = '请先选择要打断link';
    },

    check: function (editResult) {
        if (editResult.parts && editResult.parts.length > 0 && editResult.point) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
