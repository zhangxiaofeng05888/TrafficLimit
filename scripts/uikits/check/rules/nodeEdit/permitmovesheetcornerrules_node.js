/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permitmovesheetcornerrules_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'permitmovesheetcornerrules_node';
        this.description = '该点是图廓点，只能在当前图廓线上';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        if (!editResult.originObject) {
            return [];
        }
        
        var _self = this;
        this.geometryAlgorithm.geometryTransform.setEnviroment(null, null, function (map, tile, coordinates) {
            return _self.geometryAlgorithm.proj4Transform.wgs84ToXian80(coordinates);
        });

        // 利用原始几何计算出node所在图幅，从而判断该点是否为图廓点;
        var originNodeGeo = editResult.originObject.geometry.coordinates;
        var meshLayer = fastmap.mapApi.meshLayer();
        var meshId = meshLayer.Calculate25TMeshId({ lng: originNodeGeo[0], lat: originNodeGeo[1] });
        var arr = meshLayer.Calculate25TMeshBorder(meshId);
        var cornerLinkArr = this.convertBoxToFourLink(arr);
        var currentCornerLine = null;

        var isCornerNode = false;
        for (var i = 0; i < cornerLinkArr.length; i++) {
            var node = this.geometryAlgorithm.geometryTransform.convertGeometry(editResult.originObject.geometry);
            var line = this.geometryAlgorithm.geometryTransform.convertGeometry(cornerLinkArr[i]);
            var dis = this.geometryAlgorithm.distance(node, line);
            if (dis < 1) { // 小与1米认为在图廓线上;
                currentCornerLine = line;
                isCornerNode = true;
            }
        }

        if (isCornerNode) {
            var currentNode = this.geometryAlgorithm.geometryTransform.convertGeometry(editResult.finalGeometry);
            var dis2 = this.geometryAlgorithm.distance(currentNode, currentCornerLine);
            if (dis2 > 1) { // 大于一米则认为不在图廓线上;
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
