/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_6 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_6';
        this.description = '高速分歧、IC分歧的退出线必须是城高或高速';
    },

    check: function (editResult) {
        if (editResult.branchType == 0 || editResult.branchType == 2) {
            if (editResult.outLink) {
                if (parseInt(editResult.outLink.properties.kind, 10) == 1 || parseInt(editResult.outLink.properties.kind, 10) == 2) {
                    return [];
                }
            } else {
                return [];
            }
        } else {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
