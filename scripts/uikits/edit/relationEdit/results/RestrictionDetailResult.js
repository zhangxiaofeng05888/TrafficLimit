/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.RestrictionDetailResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        this.base = fastmap.uikit.EditResult.prototype;
        this.base.initialize.apply(this, arguments);

        this.pid = 0;
        this.detailId = 0;
        this.inLink = 0;
        this.node = 0;
        this.part = null;
        this.outLink = 0;
        this.viaLinks = null;
        this.isTruckRestriction = false;
    }
});
