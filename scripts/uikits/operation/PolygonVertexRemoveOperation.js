/**
 * Created by xujie3949 on 2016/12/8.
 * 删除形状点操作
 */

fastmap.uikit.operation.PolygonVertexRemoveOperation = fastmap.uikit.operation.PolygonEditOperation.extend({
    initialize: function (shapeEditor, index, point) {
        fastmap.uikit.operation.PolygonEditOperation.prototype.initialize.call(
            this,
            '删除形状点',
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
            newEditResult.finalGeometry.coordinates.splice(length - 1, 1);
            newEditResult.finalGeometry.coordinates.splice(0, 1);
            newEditResult.finalGeometry.coordinates.push(newEditResult.finalGeometry.coordinates[0]);
        } else {
            newEditResult.finalGeometry.coordinates.splice(this.index, 1);
        }
        return newEditResult;
    }
});
