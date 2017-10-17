/**
 * Created by zhaohang on 2017/10/17.
 */

fastmap.uikit.complexEdit.DrawPolygonResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'DrawPolygonResult');
        this.links = [];
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.CopyResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.links = FM.Util.clone(this.links);
    }
});
