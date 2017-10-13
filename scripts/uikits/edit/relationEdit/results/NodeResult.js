/**
 * Created by zhaohang on 2017/3/15.
 */
fastmap.uikit.relationEdit.NodeResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'NodeResult');

        this.node = null;
    }
});
