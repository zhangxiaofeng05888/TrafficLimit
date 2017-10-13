/**
 * Created by linglong on 2017/4/1.
 */
fastmap.uikit.relationEdit.SamePointRelationResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'SamePointRelationResult');
        this.relationFeatures = [];
    }
});
