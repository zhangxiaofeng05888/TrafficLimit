/**
 * Created by zhaohang on 2017/3/29.
 */

fastmap.uikit.shapeEdit.PointGuideLinkResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PointGuideLinkResult');

        this.coordinate = null; // 坐标
        this.guide = null; // 引导坐标
        this.guideLink = null; //
        this.editing = false; // false 未开始编辑， true 编辑中
        this.snapActors = [];
    }
});
