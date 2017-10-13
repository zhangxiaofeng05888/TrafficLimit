/**
 * Created by ling long on 2017/5/8.
 */
fastmap.uikit.check.rule.shaping_check_link_selfintersect_2 = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'shaping_check_link_selfintersect_2';
        this.description = '背景link不能自相交!';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        var linkGeo = editResult.finalGeometry;

        if (linkGeo.coordinates.length < 2) {
            return [];
        }
        var isIntersect = this.geometryAlgorithm.isSimple(linkGeo);
        if (!isIntersect) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
