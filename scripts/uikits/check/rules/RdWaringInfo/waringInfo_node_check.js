/**
 * Created by zhaohang on 2017/3/22.
 */
fastmap.uikit.check.rule.rdWarningInfo_node_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM09015';
        this.description = '警示信息中的点形态不能是图廓点';
    },

    check: function (editResult) {
        if (!editResult.inNode) {
            return [];
        }
        var forms = editResult.inNode.properties.forms.split(';');
        var formsFlag = false;
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        for (var i = 0; i < forms.length; i++) {
            if (forms[i] == '2') {
                formsFlag = true;
                break;
            }
        }
        if (formsFlag) {
            return [result];
        }
        return [];
    }
});
