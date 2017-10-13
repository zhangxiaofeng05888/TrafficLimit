/**
 * Created by xujie3949 on 2016/12/8.
 * 增加形状点操作
 */

fastmap.uikit.operation.PathVertexAddOperation = fastmap.uikit.operation.PathEditOperation.extend({
    initialize: function (shapeEditor, index, point, snap) {
        fastmap.uikit.operation.PathEditOperation.prototype.initialize.call(
            this,
            '添加形状点',
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
            } else {
                newEditResult.snapResults[index + 1] = snap;
            }
        }

        var point = this.point;
        if (this.snap) {
            newEditResult.snapResults[this.index] = this.snap;
            point = this.snap.point;
        }
        newEditResult.finalGeometry.coordinates.splice(this.index, 0, point.coordinates);
        return newEditResult;
    }
});
