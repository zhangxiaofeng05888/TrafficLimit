/**
 * Created by wuzhen on 2017/4/10.
 */

fastmap.uikit.check.rule.rdRoad_link_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdRoad_link_form_check';
        this.description = '至少需要一个link';
    },

    check: function (editResult) {
        if ((editResult.links && editResult.links.length > 0)) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
