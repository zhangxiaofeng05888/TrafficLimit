/**
 * Created by zhaohang on 2017/4/24.
 */

fastmap.uikit.shapeEdit.PointResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PointResult');

        this.coordinate = null; // 坐标
        this.editing = false; // false 未开始编辑， true 编辑中
        this.links = [];
        this.snapActors = [];
    }
});
