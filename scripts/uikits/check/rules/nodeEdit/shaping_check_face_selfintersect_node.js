/**
 * Created by linglong on 2017/5/8.
 */
fastmap.uikit.check.rule.shaping_check_face_selfintersect_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'shaping_check_face_selfintersect_node';
        this.description = '背景面不能自相交!';
    },

    check: function (editResult) {
        if (!editResult.topoLinks) { return []; }
        var relateFaceLinkGeo = editResult.topoLinks[0].geometry;
        var ring = FM.Util.clone(relateFaceLinkGeo);
        if (ring.coordinates.length < 3) {
            return [];
        }
        this.geometryAlgorithm.close(ring);
        var isIntersect = this.geometryAlgorithm.isSimple(ring);
        if (!isIntersect) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }

        return [];
    }
});
