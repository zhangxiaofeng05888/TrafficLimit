/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.LinkNodeLinksResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkNodeLinksResult');

        this.inLink = null;
        this.inNode = null;
        this.parts = [];
        this.currentPart = -1;
    }
});
