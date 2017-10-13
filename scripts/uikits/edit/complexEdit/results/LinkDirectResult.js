/**
 * Created by linglong on 2017/4/21.
 */

fastmap.uikit.complexEdit.LinkDirectResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'LinkDirectResult');
        this.point = null;
    }
});
