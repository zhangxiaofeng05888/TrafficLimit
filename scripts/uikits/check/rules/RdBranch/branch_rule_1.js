/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_1 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_1';
        this.description = '高速分歧、IC分歧、实景看板的进入线必须是城高或高速';
    },

    check: function (editResult) {
        if (editResult.branchType == 0 || editResult.branchType == 2 || editResult.branchType == 6) {
            if (editResult.inLink) {
                if (parseInt(editResult.inLink.properties.kind, 10) == 1 || parseInt(editResult.inLink.properties.kind, 10) == 2) {
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
