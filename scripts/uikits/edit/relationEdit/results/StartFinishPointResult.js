/**
 * Created by zhaohang on 2017/4/26.
 */

fastmap.uikit.relationEdit.StartFinishPointResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'StartFinishPointResult');

        this.vias = [];
        this.snapActors = [];
        this.startData = null;
        this.endData = null;
        this.tipLinksSelect = false;
        this.needVisaFlag = true;
        this.linkGeo = null;
    }
});
