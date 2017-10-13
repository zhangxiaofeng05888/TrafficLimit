/**
 * Created by zhaohang on 2017/5/3.
 */

fastmap.uikit.shapeEdit.BreakTipLinksResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'BreakTipLinksResult');

        this.breakPoint = null;
        this.snapActors = [];
    }
});
