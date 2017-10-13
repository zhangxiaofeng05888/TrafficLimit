/**
 * Created by zhaohang on 2017/5/3.
 */

fastmap.uikit.relationEdit.PolygonResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'PolygonResult');

        this.finalGeometry = [];
        this.tipsArray = [];
        this.editing = true;
        this.idObj = null;
    }
});
