/**
 * Created by linglong on 2017/3/22.
 */
fastmap.uikit.complexEdit.SideRoadResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'SideRoadResult');
        this.distance = undefined;
        this.sNodePid = null;
        this.sideType = 1;
        this.links = [];
    }
});
