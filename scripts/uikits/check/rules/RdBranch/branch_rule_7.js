/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_7 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_7';
        this.description = '方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧退出线';
    },

    check: function (editResult) {
        if (editResult.branchType == 1 || editResult.branchType == 6 || editResult.branchType == 9) {
            if (editResult.outLink) {
                if (parseInt(editResult.outLink.properties.kind, 10) < 9) {
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
