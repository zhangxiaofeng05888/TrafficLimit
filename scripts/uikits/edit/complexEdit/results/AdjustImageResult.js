/**
 * Created by zhongxiaoming on 2017/8/22.
 */
fastmap.uikit.complexEdit.AdjustImageResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'AdjustImageResult');
        this.startPoint = null;
        this.endPoint = null;
        this.bBox = null;
        this.finalGeometry = {};
        this.finalGeometry.coordinates = [];
        this.isFinish = false;
        this.sPoint = null; // 开始点像素坐标
        this.ePoint = null; // 结束点像素坐标
    }
});
