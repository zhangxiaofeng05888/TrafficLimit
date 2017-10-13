/**
 * Created by wuzhen on 2017/8/14.
 */

fastmap.uikit.check.rule.node_no_empty = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'node_no_empty';
        this.description = '创建要素所需条件不全，无法创建';
    },

    check: function (editResult) {
        if (editResult.node) {
            return [];
        }
        // var result = new fastmap.uikit.check.CheckResult();
        // result.message = this.description;
        // result.geoLiveType = editResult.geoLiveType;
        // result.situation = 'precheck';

        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
