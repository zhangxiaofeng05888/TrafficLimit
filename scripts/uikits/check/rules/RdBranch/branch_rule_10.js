/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_10 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_10';
        this.description = '连续分歧的退出线不能为1、2级种别以外种别的道路';
    },

    check: function (editResult) {
        if (editResult.branchType == 7) {
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
