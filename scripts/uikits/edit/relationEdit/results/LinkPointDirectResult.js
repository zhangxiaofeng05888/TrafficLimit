/**
 * Created by wangmingdong on 2017/3/22.
 */
fastmap.uikit.relationEdit.LinkPointDirectResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkPointDirectResult');

        this.link = null;
        this.point = null;
        this.direct = null;
        this.originLink = null;
    }
});
