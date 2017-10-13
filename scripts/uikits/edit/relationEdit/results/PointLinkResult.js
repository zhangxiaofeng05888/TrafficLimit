/**
 * Created by zhaohang on 2017/3/14.
 */
fastmap.uikit.relationEdit.PointLinkResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'PointLinkResult');

        this.link = null;
        this.point = null;
        this.snapActors = [];
    }
});
