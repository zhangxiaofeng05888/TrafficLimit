/**
 * Created by zhaohang on 2017/10/31.
 */

fastmap.uikit.complexEdit.BatchEditLimitResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'BatchEditLimitResult');

        this.links = [];
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.links = FM.Util.clone(this.links);
    }
});
