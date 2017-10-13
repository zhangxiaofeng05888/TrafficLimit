/**
 * Created by wangmingdong on 2017/3/22.
 */
fastmap.uikit.relationEdit.AddPairElectronicEyeResult = fastmap.uikit.EditResult.extend({
    initialize: function () {
        fastmap.uikit.EditResult.prototype.initialize.call(this, 'AddPairElectronicEyeResult');

        this.pairFeature = null;
    }
});
