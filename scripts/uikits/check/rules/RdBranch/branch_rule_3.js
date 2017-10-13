/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_3 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_3';
        this.description = '3D分歧不能以9级路、10级路、步行街和人渡的link作为分歧进入线';
    },

    check: function (editResult) {
        if (editResult.branchType == 3) {
            if (editResult.inLink) {
                if (parseInt(editResult.inLink.properties.kind, 10) != 9 && parseInt(editResult.inLink.properties.kind, 10) != 10 && parseInt(editResult.inLink.properties.kind, 10) != 11 && editResult.inLink.properties.form.split(';').indexOf('20') == -1) {
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
