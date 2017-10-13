/**
 * Created by zhaohang on 2017/3/28.
 */
fastmap.uikit.check.rule.rdVariableSpeed_recommend_viasLink_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdVariableSpeed_recommend_viasLink_check';
        this.description = '8、9、10级路、人渡、轮渡、环岛、特殊交通类型、交叉口内道路的LINK不可作为可变限速的接续link！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        var flag = false;
        if (editResult.continueLink.length > 0) {
            for (var i = 0; i < editResult.continueLink.length; i++) {
                if (['8', '9', '10', '11', '13'].indexOf(editResult.continueLink[i].properties.kind) > -1 ||
                    ['33', '50'].indexOf(editResult.continueLink[i].properties.form) > -1 ||
                    editResult.continueLink[i].properties.special == '1') {
                    flag = true;
                    break;
                }
            }
        }
        if (flag) {
            return [result];
        }
        return [];
    }
});
