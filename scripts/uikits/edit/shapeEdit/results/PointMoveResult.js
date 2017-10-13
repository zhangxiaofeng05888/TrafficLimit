/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.PointMoveResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PointMoveResult');

        this.linkType = null;
        this.topoLinks = null;
    }
});
