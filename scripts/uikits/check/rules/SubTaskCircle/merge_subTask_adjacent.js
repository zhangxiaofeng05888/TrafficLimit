/**
 * Created by zhaohang on 2017/7/11.
 */
fastmap.uikit.check.rule.merge_subTask_adjacent = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'merge_subTask_adjacent';
        this.description = '需要选择相邻两个子任务面进行合并！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        this.drawCircle = fastmap.DrawCircle.getInstance();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        var geometry1 = null;
        var geometry2 = null;
        if (this.drawCircle.data.subtask.length !== 2) {
            return [];
        }
        for (var i = 0; i < this.drawCircle.data.subtask.length; i++) {
            if (this.drawCircle.data.subtask[i].id === editResult.selectSubTaskIds[0]) {
                geometry1 = this.drawCircle.data.subtask[i].geometry;
            } else if (this.drawCircle.data.subtask[i].id === editResult.selectSubTaskIds[1]) {
                geometry2 = this.drawCircle.data.subtask[i].geometry;
            }
        }
        if (!this.geometryAlgorithm.intersects(geometry1, geometry2)) {
            return [result];
        }
        return [];
    }
});
