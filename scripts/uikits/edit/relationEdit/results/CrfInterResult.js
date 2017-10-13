/**
 * Created by wuzhen on 2017/4/1.
 */
fastmap.uikit.relationEdit.CrfInterResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'CrfInterResult');

        this.nodes = [];
        this.links = [];
        this.isCreate = null; // 用于控制是否是新增 true 表示新增，false表示修改, 新增是不可以可以选中已经做过CRFInter的rdNode,修改的时候可以选中
    }
});
