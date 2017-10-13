/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.PointAddResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PointAddResult');

        this.linkType = null;
        this.linkPid = null;
        this.snapLinks = [];
        this.linkGeometry = null;
        // 区分当前是第一次点击还是选择link
        this.flag = 1;
    }
});
