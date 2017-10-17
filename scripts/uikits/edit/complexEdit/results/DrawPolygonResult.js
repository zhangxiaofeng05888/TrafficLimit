/**
 * Created by zhaohang on 2017/10/17.
 */
/**
 * Created by zhaohang on 2017/10/16.
 */

fastmap.uikit.complexEdit.CopyResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'CopyResult');
        this.links = [];
        this.types = [];
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.CopyResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.links = FM.Util.clone(this.links);
        editResult.types = FM.Util.clone(this.types);
    }
});
