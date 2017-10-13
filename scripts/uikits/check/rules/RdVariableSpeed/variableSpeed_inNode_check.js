/**
 * Created by zhaohang on 2017/3/27.
 */
fastmap.uikit.check.rule.rdVariableSpeed_inNode_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdVariableSpeed_inNode_check';
        this.description = '可变限速的进入点不能为图廓点, 请重新选择!';
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
