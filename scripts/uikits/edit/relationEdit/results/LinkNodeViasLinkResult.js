/**
 * Created by wangmingdong on 2017/3/23.
 */

fastmap.uikit.relationEdit.LinkNodeViasLinkResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkNodeViasLinkResult');

        this.inLink = null;
        this.inNode = null;
        this.outLink = null;
        this.vias = [];
        this.branchType = null;
        this.selectType = null;
        this.relationshipType = 1;
        this.isClose = false;
    }
});
