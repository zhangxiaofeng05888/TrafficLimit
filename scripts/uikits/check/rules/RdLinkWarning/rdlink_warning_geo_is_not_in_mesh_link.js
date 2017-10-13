/**
 * Created by linglong on 2017/8/31.
 */
fastmap.uikit.check.rule.rdlink_warning_geo_is_not_in_mesh_link = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'rdlink_warning_geo_is_not_in_mesh_link';
        this.description = '警示信息geometry不能落在图廓线上';
    },

    check: function (editResult) {
        if (!editResult.point) {
            return [];
        }

        var _self = this;
        this.geometryAlgorithm.geometryTransform.setEnviroment(null, null, function (map, tile, coordinates) {
            return _self.geometryAlgorithm.proj4Transform.wgs84ToXian80(coordinates);
        });

        var meshLayer = fastmap.mapApi.meshLayer();
        var meshId = meshLayer.Calculate25TMeshId({ lng: editResult.point.coordinates[0], lat: editResult.point.coordinates[1] });
        var arr = meshLayer.Calculate25TMeshBorder(meshId);
        var cornerLinkArr = this.convertBoxToFourLink(arr);

        for (var i = 0; i < cornerLinkArr.length; i++) {
            var node = this.geometryAlgorithm.geometryTransform.convertGeometry(editResult.point);
            var line = this.geometryAlgorithm.geometryTransform.convertGeometry(cornerLinkArr[i]);
            var dis = this.geometryAlgorithm.distance(node, line);
            if (dis < 2) { // 小与2米认为在图廓线上;
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }
        return [];
    },

    convertBoxToFourLink: function (range) {
        return [
            this.uikitUtil.createPath([[range.maxLon, range.maxLat], [range.minLon, range.maxLat]]),
            this.uikitUtil.createPath([[range.minLon, range.maxLat], [range.minLon, range.minLat]]),
            this.uikitUtil.createPath([[range.minLon, range.minLat], [range.maxLon, range.minLat]]),
            this.uikitUtil.createPath([[range.maxLon, range.minLat], [range.maxLon, range.maxLat]])
        ];
    }
});
