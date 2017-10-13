/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_2 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_2';
        this.description = '方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧进入线';
    },

    check: function (editResult) {
        if (editResult.branchType == 1 || editResult.branchType == 6 || editResult.branchType == 9) {
            if (editResult.inLink) {
                if (parseInt(editResult.inLink.properties.kind, 10) < 8) {
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
