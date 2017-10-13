/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.shaping_check_link_ringnobreak_2_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'shaping_check_link_ringnobreak_2_node';
        this.description = '起终点过近（2M），并且起终点不重合!';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }

        var linkGeo = editResult.finalGeometry.coordinates;
        if (linkGeo.length < 2) {
            return [];
        }

        var _self = this;
        this.geometryAlgorithm.geometryTransform.setEnviroment(null, null, function (map, tile, coordinates) {
            return _self.geometryAlgorithm.proj4Transform.wgs84ToXian80(coordinates);
        });
        // 移动node和新增node都要判断;
        if (editResult.topoLinks) {
            if (!editResult.originObject) {
                return [];
            }
            if (this.uikitUtil.isFaceLink(editResult.topoLinks[0].geometry.coordinates)) {
                return [];
            }
            var cond = false;
            var toPoLinkOtherNode = [];
            editResult.topoLinks.forEach(function (item) {
                var linkCoord = item.geometry.coordinates;
                var linkSNode = linkCoord[0];
                var linkENode = linkCoord[linkCoord.length - 1];
                if (_self.isSamePoint(linkSNode, editResult.finalGeometry.coordinates)) {
                    toPoLinkOtherNode.push(linkENode);
                } else {
                    toPoLinkOtherNode.push(linkSNode);
                }
            });

            toPoLinkOtherNode.forEach(function (item) {
                var tempOtherNode = _self.uikitUtil.createPoint([parseFloat(item[0].toFixed(5)), parseFloat(item[1].toFixed(5))]);
                var tempMoveNode = _self.uikitUtil.createPoint([parseFloat(editResult.finalGeometry.coordinates[0].toFixed(5)), parseFloat(editResult.finalGeometry.coordinates[1].toFixed(5))]);
                var p1 = _self.geometryAlgorithm.geometryTransform.convertGeometry(tempOtherNode);
                var p2 = _self.geometryAlgorithm.geometryTransform.convertGeometry(tempMoveNode);
                var dis = _self.geometryAlgorithm.distance(p1, p2);
                dis = parseFloat(dis.toFixed(2));
                if (dis < 2) {
                    cond = true; return;
                }
            });
            if (cond) {
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        } else if (editResult.linkPid) {
            var snapLinkGeo = this.featureSelector.selectByFeatureId(editResult.linkPid, editResult.linkType).geometry.coordinates;
            var snapLinkSNode = this.uikitUtil.createPoint([parseFloat(snapLinkGeo[0][0].toFixed(5)), parseFloat(snapLinkGeo[0][1].toFixed(5))]);
            var snapLinkENode = this.uikitUtil.createPoint([parseFloat(snapLinkGeo[snapLinkGeo.length - 1][0].toFixed(5)), parseFloat(snapLinkGeo[snapLinkGeo.length - 1][1].toFixed(5))]);
            var createPointGeo = this.uikitUtil.createPoint([parseFloat(editResult.finalGeometry.coordinates[0].toFixed(5)), parseFloat(editResult.finalGeometry.coordinates[1].toFixed(5))]);

            var dis1 = this.geometryAlgorithm.sphericalDistance(snapLinkSNode, createPointGeo);
            var dis2 = this.geometryAlgorithm.sphericalDistance(snapLinkENode, createPointGeo);
            dis1 = parseFloat(dis1.toFixed(2));
            dis2 = parseFloat(dis2.toFixed(2));

            if (dis1 < 2 || dis2 < 2) {
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }

        return [];
    },

    isSamePoint: function (point1, point2, precision) {
        if (!precision) {
            precision = 5;
        }
        if (Number(point1[0]).toFixed(precision) != Number(point2[0]).toFixed(precision)) {
            return false;
        }
        if (Number(point1[1]).toFixed(precision) != Number(point2[1]).toFixed(precision)) {
            return false;
        }
        return true;
    }
});
