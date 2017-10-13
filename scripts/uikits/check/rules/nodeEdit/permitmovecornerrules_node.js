/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permitmovecornerrules_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'permitmovecornerrules_node';
        this.description = '该点是角点，不能移动';
    },

    check: function (editResult) {
        if (!editResult.originObject) {
            return [];
        }
        var nodeForm = editResult.originObject.form;
        if (nodeForm === 7) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
