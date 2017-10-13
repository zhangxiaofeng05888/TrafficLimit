/**
 * Created by wuzhen on 2017/4/9.
 * crfOjbect(crf对象)
 */
fastmap.uikit.relationEdit.CrfObjectResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'CrfObjectResult');

        this.links = [];
        this.inters = [];
        this.roads = [];
        this.coordinate = null;
        this.isCreate = null; // 用于控制是否是新增 true 表示新增，false表示修改, 新增是不可以可以选中已经做过CRFRoad的rdlink,修改的时候可以选中
    }
});
