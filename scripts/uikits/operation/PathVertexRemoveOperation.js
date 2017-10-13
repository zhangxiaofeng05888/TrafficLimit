/**
 * Created by xujie3949 on 2016/12/8.
 * 删除形状点操作
 */

fastmap.uikit.operation.PathVertexRemoveOperation = fastmap.uikit.operation.PathEditOperation.extend({
    initialize: function (shapeEditor, index, point, snap) {
        fastmap.uikit.operation.PathEditOperation.prototype.initialize.call(
            this,
            '删除形状点',
            shapeEditor,
            index,
            point,
            snap
        );

        this.newEditResult = this.getNewEditResult();
    },

    getNewEditResult: function () {
        var newEditResult = this.oldEditResult.clone();
        var results = newEditResult.snapResults;
        newEditResult.snapResults = {};
        var keys = Object.getOwnPropertyNames(results);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var index = parseInt(key, 10);
            var snap = results[key];
            if (index < this.index) {
                newEditResult.snapResults[index] = snap;
            } else if (index === this.index) {
                continue;
            } else {
                newEditResult.snapResults[index - 1] = snap;
            }
        }

        newEditResult.finalGeometry.coordinates.splice(this.index, 1);
        return newEditResult;
    }
});
