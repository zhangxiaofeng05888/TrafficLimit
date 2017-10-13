/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.ShapeEditResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.apply(this, arguments);

        this.finalGeometry = null;
        this.snapResults = {};
    },

    clone: function () {
        var editResult = new fastmap.uikit.shapeEdit.ShapeEditResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.finalGeometry = FM.Util.clone(this.finalGeometry);
        editResult.snapResults = FM.Util.clone(this.snapResults);
    }
});
