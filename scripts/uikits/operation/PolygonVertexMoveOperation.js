/**
 * Created by xujie3949 on 2016/12/8.
 * 移动形状点操作
 */

fastmap.uikit.operation.PolygonVertexMoveOperation = fastmap.uikit.operation.PolygonEditOperation.extend({
    initialize: function (shapeEditor, index, point, snap) {
        fastmap.uikit.operation.PolygonEditOperation.prototype.initialize.call(
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
        // 捕捉点
        var results = newEditResult.snapResults;
        if (results.hasOwnProperty(this.index)) {
            delete results[this.index];
        }

        var point = this.point;
        if (this.snap) {
            newEditResult.snapResults[this.index] = this.snap;
            point = this.snap.point;
        }
        var ls = newEditResult.finalGeometry;
        var length = ls.coordinates.length;
        if (this.index === 0 || this.index === length - 1) {
            newEditResult.finalGeometry.coordinates[0] = point.coordinates;
            newEditResult.finalGeometry.coordinates[length - 1] = point.coordinates;
        } else {
            newEditResult.finalGeometry.coordinates[this.index] = point.coordinates;
        }

        return newEditResult;
    }
});

