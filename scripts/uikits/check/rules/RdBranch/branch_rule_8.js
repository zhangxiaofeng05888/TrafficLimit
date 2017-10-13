/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_8 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_8';
        this.description = '3D分歧不能以10级路、步行街和人渡的link作为分歧退出线';
    },

    check: function (editResult) {
        if (editResult.branchType == 3) {
            if (editResult.outLink) {
                if (parseInt(editResult.outLink.properties.kind, 10) != 10 && parseInt(editResult.outLink.properties.kind, 10) != 11 && editResult.outLink.properties.form.split(';').indexOf('20') == -1) {
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
