/**
 * Created by xujie3949 on 2016/12/8.
 * 增加形状点操作
 */

fastmap.uikit.operation.PolygonVertexAddOperation = fastmap.uikit.operation.PolygonEditOperation.extend({
    initialize: function (shapeEditor, index, point) {
        fastmap.uikit.operation.PolygonEditOperation.prototype.initialize.call(
            this,
            '添加形状点',
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
        if (length >= 3 && this.pointEqual(this.coordinatesToPoint(ls.coordinates[0]), this.point)) {
            newEditResult.isClosed = true;
        }

        newEditResult.finalGeometry.coordinates.splice(this.index, 0, this.point.coordinates);
        return newEditResult;
    },

    coordinatesToPoint: function (coordinates) {
        return {
            type: 'Point',
            coordinates: coordinates
        };
    }
});
