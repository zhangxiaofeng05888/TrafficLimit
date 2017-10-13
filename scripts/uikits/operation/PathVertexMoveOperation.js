/**
 * Created by xujie3949 on 2016/12/8.
 * 移动形状点操作
 */

fastmap.uikit.operation.PathVertexMoveOperation = fastmap.uikit.operation.PathEditOperation.extend({
    initialize: function (shapeEditor, index, point, snap) {
        fastmap.uikit.operation.PathEditOperation.prototype.initialize.call(
            this,
            '移动形状点',
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
        if (results.hasOwnProperty(this.index)) {
            delete results[this.index];
        }

        var point = this.point;
        if (this.snap) {
            newEditResult.snapResults[this.index] = this.snap;
            point = this.snap.point;
        }

        newEditResult.finalGeometry.coordinates[this.index] = point.coordinates;
        return newEditResult;
    }
});

