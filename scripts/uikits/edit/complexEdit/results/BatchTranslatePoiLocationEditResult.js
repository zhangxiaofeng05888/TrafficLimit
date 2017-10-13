/**
 * Created by wuzhen on 2017/03/31.
 */

fastmap.uikit.complexEdit.BatchTranslatePoiLocationEditResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'BatchTranslatePoiLocationEditResult');

        this.pois = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.operationType = 'select';
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.BatchTranslatePoiLocationEditResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.pois = FM.Util.clone(this.pois);
        editResult.offsetX = FM.Util.clone(this.offsetX);
        editResult.offsetY = FM.Util.clone(this.offsetY);
        editResult.operationType = FM.Util.clone(this.operationType);
    }
});
