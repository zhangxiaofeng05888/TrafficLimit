/**
 * Created by wuzhen on 2017/3/23.
 */
fastmap.uikit.check.rule.rdSlope_outLink_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdSlope_outLink_form_check';
        this.description = '创建要素所需条件不全，无法创建';
    },

    check: function (editResult) {
        if (editResult.inNode && editResult.outLink && editResult.linkLength) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
