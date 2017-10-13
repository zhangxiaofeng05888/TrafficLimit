/**
 * Created by xujie3949 on 2016/12/8.
 * 检查规则基类,所有检查规则都从此类派生

*/
fastmap.uikit.check.CheckRule = L.Class.extend({
    initialize: function () {
        this.Id = '';
        this.description = '';
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
    },

    /**
     * 子类需要重写此方法
     */
    check: function (editResult) {
        return [];
    },

    getCheckResult: function (description, geoLiveType, situation) {
        if (!situation) {
            situation = 'runtime';
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = description;
        result.geoLiveType = geoLiveType;
        result.situation = situation;
        return result;
    }
});
