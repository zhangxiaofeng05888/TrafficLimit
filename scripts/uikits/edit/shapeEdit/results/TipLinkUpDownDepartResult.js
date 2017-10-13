/**
 * Created by zhongxiaoming on 2017/8/18.
 */

fastmap.uikit.shapeEdit.TipLinkUpDownDepartResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'TipLinkUpDownDepartResult');
        this.pid = null;
        this.distance = undefined; // 上下线分离的默认值;
        this.sideType = 1;
        this.links = [];
    }
});
