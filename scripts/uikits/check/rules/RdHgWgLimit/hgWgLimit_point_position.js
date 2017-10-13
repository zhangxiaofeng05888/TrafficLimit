/**
 * Created by zhaohang on 2017/3/24.
 */
fastmap.uikit.check.rule.rdHgWgLimit_point_position = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdHgWgLimit_point_position';
        this.description = '卡车地图不能制作到关联link端点!';
    },

    check: function (editResult) {
        if (!editResult.link || !editResult.point) {
            return [];
        }
        var pointLat = editResult.point.coordinates[1];
        var pointLng = editResult.point.coordinates[0];
        var linkGeo = editResult.link.geometry.coordinates;
        if (L.latLng(pointLat, pointLng).distanceTo(L.latLng(linkGeo[0][1], linkGeo[0][0])) < 1 ||
            L.latLng(pointLat, pointLng).distanceTo(L.latLng(linkGeo[linkGeo.length - 1][1], linkGeo[linkGeo.length - 1][0])) < 1) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
