/**
 * Created by wuzhen on 2017/03/31.
 */

fastmap.uikit.complexEdit.PoiParentResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PoiParentResult');

        this.operFlag = null;
        this.parentPid = null;
    }
});
