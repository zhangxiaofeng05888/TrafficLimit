/**
 * Created by wuzhen on 2017/03/31.
 */

fastmap.uikit.complexEdit.BatchPoiGuideManualEditResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'BatchPoiGuideManualEditResult');

        this.pois = [];
        this.point = null;
        this.guidePoint = null;
        this.guideLink = null;
        this.operationType = 'selectPoi';
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.BatchPoiGuideManualEditResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.pois = FM.Util.clone(this.pois);
        editResult.point = FM.Util.clone(this.point);
        editResult.guidePoint = FM.Util.clone(this.guidePoint);
        editResult.guideLink = FM.Util.clone(this.guideLink);
        editResult.operationType = FM.Util.clone(this.operationType);
    }
});
