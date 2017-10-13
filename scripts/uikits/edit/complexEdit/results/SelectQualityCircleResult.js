/**
 * Created by zhaohang on 2017/7/13.
 */

fastmap.uikit.complexEdit.SelectQualityCircleResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'SelectQualityCircleResult');
        this.selectQualityData = null;
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.SelectQualityCircleResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.selectQualityData = FM.Util.clone(this.selectQualityData);
    }
});
