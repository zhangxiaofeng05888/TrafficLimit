/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.RDCrossResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'RDCrossResult');

        this.nodes = [];
        this.links = [];
    }
});
