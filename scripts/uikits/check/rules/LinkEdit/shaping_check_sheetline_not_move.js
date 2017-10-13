/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.shaping_check_sheetline_not_move = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'shaping_check_sheetline_not_move';
        this.description = '图廓线上的Link不能进行移动';
    },

    check: function (editResult) {
        if (!editResult.originObject) {
            return [];
        }
        var nodeMeshLength = editResult.originObject.meshId.split(',').length;
        if (nodeMeshLength > 1) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
