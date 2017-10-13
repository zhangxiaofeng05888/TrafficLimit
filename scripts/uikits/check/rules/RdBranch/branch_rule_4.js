/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_rule_4 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_rule_4';
        this.description = '实景图的进入线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡、交叉口link';
    },

    check: function (editResult) {
        if (editResult.branchType == 5) {
            if (editResult.inLink) {
                if ((parseInt(editResult.inLink.properties.kind, 10) != 9 && parseInt(editResult.inLink.properties.kind, 10) != 10
                    && parseInt(editResult.inLink.properties.kind, 10) != 11 && parseInt(editResult.inLink.properties.kind, 10) != 13)
                    && (editResult.inLink.properties.form.split(';').indexOf('20') == -1 && editResult.inLink.properties.form.split(';').indexOf('22') == -1
                && editResult.inLink.properties.form.split(';').indexOf('50') == -1)) {
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
