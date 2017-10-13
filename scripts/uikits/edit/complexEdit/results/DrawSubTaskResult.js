/**
 * Created by zhaohang on 2017/7/10.
 */

fastmap.uikit.complexEdit.DrawSubTaskResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'DrawSubTaskResult');
        this.selectSubTaskId = null;
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.DrawSubTaskResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.selectSubTaskId = FM.Util.clone(this.selectSubTaskId);
    }
});
