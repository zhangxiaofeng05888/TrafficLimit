/**
 * Created by zhaohang on 2017/11/15.
 */

fastmap.uikit.complexEdit.TrackResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'TrackResult');
        this.linkPids = null;
        this.inLink = null;
        this.outLink = null;
        this.inNode = null;
        this.outNode = null;
    },

    clone: function () {
        var editResult = new fastmap.uikit.complexEdit.TrackResult();
        this.cloneProperties(editResult);
        return editResult;
    },

    cloneProperties: function (editResult) {
        fastmap.uikit.EditResult.prototype.cloneProperties.call(this, editResult);
        editResult.linkPids = FM.Util.clone(this.linkPids);
        editResult.inLink = FM.Util.clone(this.inLink);
        editResult.outLink = FM.Util.clone(this.outLink);
        editResult.inNode = FM.Util.clone(this.inNode);
        editResult.outNode = FM.Util.clone(this.outNode);
    }
});
