/**
 * Created by xujie on 2017/4/19.
 */
fastmap.uikit.check.rule.link_snap_link_limit_to_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);

        this.id = 'link_snap_link_limit_to_node';
        this.description = '捕捉位置距离link端点过近';
    },

    check: function (editResult) {
        var errs = [];
        if (!editResult.snapResults) return errs;
        var snapResults = editResult.snapResults;
        var keys = Object.getOwnPropertyNames(snapResults);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var snapResult = snapResults[key];
            if (snapResult.feature && snapResult.feature.geometry && snapResult.feature.geometry.type === 'LineString') {
                var err = this.checkSnapResult(snapResult);
                if (err) {
                    errs.push(err);
                }
            }
        }
        return errs;
    },

    checkSnapResult: function (snapResult) {
        // 将计算距离的几何都转换位5位小数保持与服务端一致;
        var point = this.geometryAlgorithm.precisionGeometry(snapResult.point, 5);
        var ls = this.geometryAlgorithm.precisionGeometry(snapResult.feature.geometry, 5);

        var sPoint = this.coordinatesToPoint(ls.coordinates[0]);
        var ePoint = this.coordinatesToPoint(ls.coordinates[ls.coordinates.length - 1]);
        var disSPoint = this.geometryAlgorithm.sphericalDistance(point, sPoint);
        if (disSPoint < 2) {
            return this.getCheckResult(this.description, 'RDLINK', 'runtime');
        }

        var disEPoint = this.geometryAlgorithm.sphericalDistance(point, ePoint);
        if (disEPoint < 2) {
            return this.getCheckResult(this.description, 'RDLINK', 'runtime');
        }

        return null;
    },

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
    }
});
