/**
 * Created by linglong on 2017/3/28.
 */

fastmap.uikit.shapeEdit.TipBorderResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'TipBorderResult');
        this.startNode = null;
    }
});
