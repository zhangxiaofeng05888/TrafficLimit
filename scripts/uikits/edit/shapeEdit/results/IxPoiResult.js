/**
 * Created by wuzhen on 2017/03/27.
 */

fastmap.uikit.shapeEdit.IxPoiResult = fastmap.uikit.shapeEdit.ShapeEditResult.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeEditResult.prototype.initialize.call(this, 'IxPoiResult');

        this.coordinate = null; // 坐标
        this.guide = null; // 引导坐标
        this.tipOrLinkFlag = 0; // 1表示link，2表示测线
        this.guideLink = null; //
        this.editing = false; // false 未开始编辑， true 编辑中
        this.name = null;
        this.kindCode = null;
        this.rawFields = null;  // 无效位移判断需要此字段

        this.operFlag = null; // 1新增 2删除 3修改；修改父子关系时有三种操作所以需要增加此字段
        this.parentPid = null; // 父pid 接口需要
    }
});
