/**
 * Created by wuzhen on 2017/03/31.
 */

fastmap.uikit.complexEdit.BatchPoiGuideAutoEditResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'BatchPoiGuideAutoEditResult');

        this.pois = [];
        this.links = [];
        this.guidePoints = [];
        this.guideLinks = [];
        this.operationType = 'selectPoi';
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.BatchPoiGuideAutoEditResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.pois = FM.Util.clone(this.pois);
        editResult.links = FM.Util.clone(this.links);
        editResult.guidePoints = FM.Util.clone(this.guidePoints);
        editResult.guideLinks = FM.Util.clone(this.guideLinks);
        editResult.operationType = FM.Util.clone(this.operationType);
    }
});
