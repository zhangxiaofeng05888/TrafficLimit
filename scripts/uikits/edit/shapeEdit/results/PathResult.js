/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.PathResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PathResult');

        this.snapActors = [];
        this.changeDirection = true;
    },

    clone: function () {
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.cloneProperties.call(this, editResult);
        editResult.snapActors = FM.Util.clone(this.snapActors);
        editResult.changeDirection = FM.Util.clone(this.changeDirection);
    }
});
