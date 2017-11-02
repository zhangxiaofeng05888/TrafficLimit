/**
 * Created by zhaohang on 2017/11/1.
 */

fastmap.uikit.complexEdit.BreakEditLineResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'BreakEditLineResult');

        this.breakPoint = null;
        this.snapActors = [];
        this.id = '';
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.BreakEditLineResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.breakPoint = FM.Util.clone(this.breakPoint);
        editResult.snapActors = FM.Util.clone(this.snapActors);
        editResult.id = FM.Util.clone(this.id);
    }
});
