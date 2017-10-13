/**
 * Created by mali on 2017/3/16.
 */
fastmap.uikit.relationEdit.LineDimensionsResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LineDimensionsResult');

        this.links = [];
        this.firstLink = null;
        this.firstNodePid = null;
        this.lastNodePid = null;
        this.snapFeatureType = null;
        this.nodeType = null;
        this.topoLinks = [];
    }
});
