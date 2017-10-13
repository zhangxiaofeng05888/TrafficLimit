/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permitmovesheetcornerrules_link = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'permitmovesheetcornerrules_link';
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

        var linkGeo = editResult.finalGeometry.coordinates;
        var originLinkGeo = editResult.originObject.geometry.coordinates;

        if (linkGeo.length < 2) {
            return [];
        }

        var currentFirstNode = this.uikitUtil.createPoint(linkGeo[0]);
        var currentLastNode = this.uikitUtil.createPoint(linkGeo[linkGeo.length - 1]);
        var originFirstNode = this.uikitUtil.createPoint(originLinkGeo[0]);
        var originLastNode = this.uikitUtil.createPoint(originLinkGeo[originLinkGeo.length - 1]);
        var meshLayer = fastmap.mapApi.meshLayer();

        // 如果起点终点是图廓点，则存储其对应的link;.
        var moveCornerLine = {
            startNodeLink: null,
            endNodeLink: null
        };
        // 根据link所在的图幅得到图幅所有的边界线;
        var meshId = editResult.originObject.meshId + '';
        var ids = meshId.split(',');    //  市街图会出现跨图幅的情况
        for (var i = 0, len = ids.length; i < len; i++) {
            var arr = meshLayer.Calculate25TMeshBorder(ids[i] + '');
            var originCornerArr = _self.convertBoxToFourLink(arr);

            originCornerArr.forEach(function (item) {
                var originCornerLine = _self.geometryAlgorithm.geometryTransform.convertGeometry(item);
                var originP1 = _self.geometryAlgorithm.geometryTransform.convertGeometry(originFirstNode);
                var originP2 = _self.geometryAlgorithm.geometryTransform.convertGeometry(originLastNode);
                var dis1 = _self.geometryAlgorithm.distance(originP1, originCornerLine);
                var dis2 = _self.geometryAlgorithm.distance(originP2, originCornerLine);
                if (dis1 < 1) {
                    moveCornerLine.startNodeLink = originCornerLine;
                }
                if (dis2 < 1) {
                    moveCornerLine.endNodeLink = originCornerLine;
                }
            });
        }

        var currentP1 = _self.geometryAlgorithm.geometryTransform.convertGeometry(currentFirstNode);
        var currentP2 = _self.geometryAlgorithm.geometryTransform.convertGeometry(currentLastNode);
        if (moveCornerLine.startNodeLink) {
            var dis1 = _self.geometryAlgorithm.distance(currentP1, moveCornerLine.startNodeLink);
            if (dis1 > 1) {
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }
        if (moveCornerLine.endNodeLink) {
            var dis2 = _self.geometryAlgorithm.distance(currentP2, moveCornerLine.endNodeLink);
            if (dis2 > 1) {
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
