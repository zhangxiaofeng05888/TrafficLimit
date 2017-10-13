/**
 * Created by chenx on 2017/3/21.
 */

fastmap.uikit.relationEdit.LaneConnexityResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LaneConnexityResult');

        this.inLink = null;
        this.inNode = null;
        this.lanes = [];
        this.topos = [];
        this.currentTopoIndex = -1;
        this.editingType = 'outLink';
    }
});
