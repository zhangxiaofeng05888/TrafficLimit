/**
 * Created by zhaohang on 2017/4/19.
 */

fastmap.uikit.relationEdit.ScopeLineResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'ScopeLineResult');

        this.links = [];
        this.polygon = {};
    }
});
