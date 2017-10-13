/**
 * Created by zhaohang on 2017/7/11.
 */

fastmap.uikit.complexEdit.MergeSubTaskResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'DrawSubTaskResult');
        this.selectSubTaskIds = [];
        this.geoLiveType = 'MERGESUBTASK';
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.MergeSubTaskResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.selectSubTaskIds = FM.Util.clone(this.selectSubTaskIds);
        editResult.geoLiveType = FM.Util.clone(this.geoLiveType);
    }
});
