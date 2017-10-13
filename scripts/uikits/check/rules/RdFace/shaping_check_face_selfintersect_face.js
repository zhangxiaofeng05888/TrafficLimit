/**
 * Created by linglong on 2017/5/8.
 */
fastmap.uikit.check.rule.shaping_check_face_selfintersect_face = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'shaping_check_face_selfintersect_face';
        this.description = '背景面不能自相交!';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        var linkGeo = editResult.finalGeometry;
        
        if (linkGeo.coordinates.length < 3) {
            return [];
        }

        var ring = FM.Util.clone(editResult.finalGeometry);
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
