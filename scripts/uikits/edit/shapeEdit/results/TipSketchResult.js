/**
 * Created by zhaohang on 2017/5/31.
 */

fastmap.uikit.shapeEdit.TipSketchResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'TipSketchResult');
        this.startNode = null;
    }
});
