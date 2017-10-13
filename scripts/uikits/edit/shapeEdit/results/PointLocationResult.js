/**
 * Created by wuzhen on 2017/03/27.
 * 用于点位操作,比如行政区划代表点
 */

fastmap.uikit.shapeEdit.PointLocationResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'PointLocationResult');

        this.coordinate = null; // 坐标
        
        this.guide = null; // 引导坐标
        this.guideLink = null; // 引导link
    }
});
