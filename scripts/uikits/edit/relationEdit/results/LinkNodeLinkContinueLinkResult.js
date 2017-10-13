/**
 * Created by zhaohang on 2017/3/27.
 */
fastmap.uikit.relationEdit.LinkNodeLinkContinueLinkResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkNodeLinkContinueLinkResult');

        this.inLink = null;
        this.inNode = null;
        this.outLink = null;
        this.continueLink = [];
    }
});
