/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.LinkNodeLinkResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkNodeLinkResult');

        this.inLink = 0;
        this.node = 0;
        this.outLink = 0;
    }
});
