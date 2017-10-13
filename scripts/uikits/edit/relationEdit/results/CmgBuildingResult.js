/**
 * Created by mali on 2017/5/9.
 */
fastmap.uikit.relationEdit.CmgBuildingResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'CmgBuildingResult');

        this.faces = [];
    }
});
