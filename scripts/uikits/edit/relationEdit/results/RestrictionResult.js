/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.RestrictionResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'RestrictionResult');

        this.inLink = null;
        this.node = null;
        this.parts = [];
        this.currentPart = -1;
        this.isTruckRestriction = false;
    }
});
