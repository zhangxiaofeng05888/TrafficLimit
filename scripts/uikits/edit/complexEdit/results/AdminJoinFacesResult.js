/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.complexEdit.AdminJoinFacesResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'AdminJoinFacesResult');
        this.adAdminObj = null;
        this.faceObj = null;
    }
});
