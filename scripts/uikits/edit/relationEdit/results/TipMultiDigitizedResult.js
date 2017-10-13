/**
 * Created by zhaohang on 2017/5/17.
 */

fastmap.uikit.relationEdit.TipMultiDigitizedResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'TipMultiDigitizedResult');

        this.startPointData = null;
        this.finishPointData = null;
        this.startFinishLocation = null;
        this.snapActors = [];
    }
});
