/**
 * Created by zhaohang on 2017/3/15.
 */
fastmap.uikit.relationEdit.LinkNodeResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkNodeResult');
        this.inLink = null;
        this.inNode = null;
    }
});
