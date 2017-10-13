/**
 * Created by linglong on 2017/4/1.
 */
fastmap.uikit.relationEdit.SameLineRelationResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'SameLineRelationResult');
        this.relationFeatures = [];
    }
});
