/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permit_check_rdnode_is_not_move_to_corner_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);
        this.id = 'permit_check_rdnode_is_not_move_to_corner_node';
        this.description = '不允许移动形状点到角点处';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        var PointGeo = this.geometryAlgorithm.precisionGeometry(editResult.finalGeometry, 5).coordinates;
        if (!PointGeo.length) {
            return [];
        }
        // 取其中一个形状点坐标用来计算图幅号;
        var tempPoint = { lng: PointGeo[0], lat: PointGeo[1] };
        var meshLayer = fastmap.mapApi.meshLayer();
        var meshId = meshLayer.Calculate25TMeshId(tempPoint);
        var temp = new fastmap.mapApi.GridLayer();
        var arr = temp.Calculate25TMeshBorder(meshId + '');
        var hornPoints = [[arr.maxLon, arr.maxLat], [arr.minLon, arr.maxLat], [arr.maxLon, arr.minLat], [arr.minLon, arr.minLat]];
        for (var j = 0; j < hornPoints.length; j++) {
            var linkPoint = L.latLng(PointGeo[0], PointGeo[1]);
            var hornPoint = L.latLng(this.geometryAlgorithm.precision(hornPoints[j][0], 5), this.geometryAlgorithm.precision(hornPoints[j][1], 5));
            var dis = linkPoint.distanceTo(hornPoint);
            if (dis < 2) { // 小于2米认为重合;
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }
        return [];
    }
});
