/**
 * Created by wuzhen on 2017/03/31.
 */

fastmap.uikit.complexEdit.BatchConvergePoiLocationEditResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'BatchConvergePoiLocationEditResult');

        this.pois = [];
        this.point = null;
        this.operationType = 'select';
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.BatchConvergePoiLocationEditResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.pois = FM.Util.clone(this.pois);
        editResult.point = FM.Util.clone(this.point);
        editResult.operationType = FM.Util.clone(this.operationType);
    }
});
