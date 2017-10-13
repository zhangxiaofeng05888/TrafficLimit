/**
 * Created by wuzhen on 2017/4/9.
 */

fastmap.uikit.check.rule.rdInter_node_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdInter_node_form_check';
        this.description = '至少需要一个node点';
    },

    check: function (editResult) {
        if ((editResult.nodes && editResult.nodes.length > 0)) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
