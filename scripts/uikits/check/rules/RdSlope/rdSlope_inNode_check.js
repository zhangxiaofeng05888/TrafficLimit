/**
 * Created by wuzhen on 2017/4/17.
 */
fastmap.uikit.check.rule.rdSlope_inNode_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdSlope_inNode_check';
        this.description = '进入点不能为图廓点';
    },

    check: function (editResult) {
        if (!editResult.inNode) {
            return [];
        }
        var froms = editResult.inNode.properties.forms.split(';');
        if (froms.indexOf('2') < 0) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
    }
});
