/**
 * Created by xujie3949 on 2016/12/8.
 * 移动形状点操作
 */

fastmap.uikit.operation.PolygonVertexMoveOperation = fastmap.uikit.operation.PolygonEditOperation.extend({
    initialize: function (shapeEditor, index, point) {
        fastmap.uikit.operation.PolygonEditOperation.prototype.initialize.call(
            this,
            '移动形状点',
            shapeEditor,
            index,
            point
        );

        this.newEditResult = this.getNewEditResult();
    },

    getNewEditResult: function () {
        var newEditResult = this.oldEditResult.clone();

        var ls = newEditResult.finalGeometry;
        var length = ls.coordinates.length;
        if (this.index === 0 || this.index === length - 1) {
            newEditResult.finalGeometry.coordinates[0] = this.point.coordinates;
            newEditResult.finalGeometry.coordinates[length - 1] = this.point.coordinates;
        } else {
            newEditResult.finalGeometry.coordinates[this.index] = this.point.coordinates;
        }

        return newEditResult;
    }
});

