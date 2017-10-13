/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.PolygonResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PolygonResult');

        this.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };

        this.isClosed = false;
    },

    clone: function () {
        var editResult = new fastmap.uikit.shapeEdit.PolygonResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.cloneProperties.call(this, editResult);
        editResult.finalGeometry = FM.Util.clone(this.finalGeometry);
        editResult.isClosed = FM.Util.clone(this.isClosed);
    }
});
