/**
 * Created by wuzhen on 2017/03/31.
 */

fastmap.uikit.complexEdit.SamePoiResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'SamePoiResult');

        this.samePids = [];
    }
});
