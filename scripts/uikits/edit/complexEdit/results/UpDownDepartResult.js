/**
 * Created by linglong on 2017/3/22.
 */
fastmap.uikit.complexEdit.UpDownDepartResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'UpDownDepartResult');
        this.distance = undefined; // 上下线分离的默认值;
        this.sideType = 1;
        this.links = [];
    }
});
