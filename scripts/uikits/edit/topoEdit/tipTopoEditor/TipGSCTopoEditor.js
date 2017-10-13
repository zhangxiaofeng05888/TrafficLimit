/**
 * Created by zhaohang on 2017/6/20.
 */

fastmap.uikit.topoEdit.TipGSCTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TipTopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.TipGSCResult();
        editResult.geoLiveType = 'TIPGSC';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.TipGSCResult();
        var list = [];
        var i,
            j;
        for (i = 0; i < obj.deep.f_array.length; i++) {
            var type;
            if (obj.deep.f_array[i].type === 1) {
                type = 'RDLINK';
            } else if (obj.deep.f_array[i].type === 2) {
                type = 'TIPLINKS';
            } else {
                type = 'RWLINK';
            }
            var lineGeometry = type === 'TIPLINKS' ? this.featureSelector.selectByFeatureId(obj.deep.f_array[i].id, type).geometry.geometries[1] : this.featureSelector.selectByFeatureId(obj.deep.f_array[i].id, type).geometry;
            var pointLocation = this.geometryAlgorithm.nearestLocations(obj.geometry.g_location, lineGeometry);

            list.push({
                feature: this.featureSelector.selectByFeatureId(obj.deep.f_array[i].id, type),
                seqNum: pointLocation.previousIndex,
                zlevel: obj.deep.f_array[i].z
            });
        }
        var parts = this.uikitUtil.splitLinks(obj.geometry.g_guide, list);
        for (i = 0; i < parts.length; i++) {
            for (j = 0; j < list.length; j++) {
                if (this.uikitUtil.isSameFeature(parts[i].feature, list[j].feature) && parts[i].seqNum == list[j].seqNum) {
                    parts[i].zlevel = list[j].zlevel;
                    break;
                }
            }
        }
        parts.sort(function (a, b) {
            return a.zlevel > b.zlevel ? 1 : -1;
        });
        editResult.originObject = obj;
        editResult.point = obj.geometry.g_location;
        editResult.parts = parts;
        editResult.geoLiveType = 'TIPGSC';
        editResult.operation = 'SortLink';
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var gscData = fastmap.dataApi.tipGSC({});
        gscData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.point, 5);
        gscData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.point, 5);
        var links = [];
        for (var i = 0; i < editResult.parts.length; i++) {
            var type;
            var lineGeometry = this.cutLineByLength(editResult.parts[i].segment, editResult.point, 5);
            if (editResult.parts[i].feature.properties.geoLiveType === 'RDLINK') {
                type = 1;
            } else if (editResult.parts[i].feature.properties.geoLiveType === 'TIPLINKS') {
                type = 2;
            } else {
                type = 3;
            }
            links.push({
                id: editResult.parts[i].feature.properties.id.toString(),
                type: type,
                z: editResult.parts[i].zlevel,
                geo: this.geometryAlgorithm.precisionGeometry(lineGeometry, 5)
            });
        }
        gscData.deep.f_array = links;
        return this.dataServiceTips.saveTips(gscData, 0);
    },

    update: function (editResult) {
        var gscData = editResult.originObject;
        var links = [];
        for (var i = 0; i < editResult.parts.length; i++) {
            var type;
            var lineGeometry = this.cutLineByLength(editResult.parts[i].segment, editResult.point, 5);
            if (editResult.parts[i].feature.properties.geoLiveType === 'RDLINK') {
                type = 1;
            } else if (editResult.parts[i].feature.properties.geoLiveType === 'TIPLINKS') {
                type = 2;
            } else {
                type = 3;
            }
            links.push({
                id: editResult.parts[i].feature.properties.id.toString(),
                type: type,
                z: editResult.parts[i].zlevel,
                geo: this.geometryAlgorithm.precisionGeometry(lineGeometry, 5)
            });
        }
        gscData.deep.f_array = links;
        return this.dataServiceTips.saveTips(gscData, 1);
    },

    cutLineByLength: function (line, point, length) {
        var self = this;
        var func = function (map, tile, coordinates) {
            return self.proj4Transform.wgs84ToXian80(coordinates);
        };
        this.geometryTransform.setEnviroment(null, null, func);
        var lineGeometry = this.geometryTransform.convertGeometry(line);
        var pointGeometry = this.geometryTransform.convertGeometry(point);
        var pointLocation = this.geometryAlgorithm.nearestLocations(pointGeometry, lineGeometry);
        var spliceLength = this.getLength(lineGeometry, pointLocation);
        var spliceLines = this.spliceLine(lineGeometry, spliceLength);
        this.geometryTransform.setEnviroment(null, null, function (map, tile, coordinates) {
            return self.proj4Transform.xian80ToWGS84(coordinates);
        });
        var spliceGeometry = this.geometryTransform.convertGeometry(this.getSpliceGeometry(spliceLines, length));
        return spliceGeometry;
    },

    getLength: function (line, pointLocation) {
        var length = 0;
        for (var i = 0; i < pointLocation.previousIndex; i++) {
            length += this.geometryAlgorithm.distance({ type: 'Point', coordinates: line.coordinates[i] }, { type: 'Point', coordinates: line.coordinates[i + 1] });
        }
        length += this.geometryAlgorithm.distance(pointLocation.previousPoint, pointLocation.point);
        return length;
    },

    spliceLine: function (line, length) {
        var lineGeojson = this.geometryFactory.fromGeojson(line);
        var spliceLine = lineGeojson.splitByLength(length);
        var startLine = spliceLine[0];
        var endLine = spliceLine[1];
        if (spliceLine[0]) {
            startLine = this.geometryFactory.toGeojson(spliceLine[0]);
        }
        if (spliceLine[1]) {
            endLine = this.geometryFactory.toGeojson(spliceLine[1]);
        }
        return [startLine, endLine];
    },

    getSpliceGeometry: function (lines, length) {
        var startLine = lines[0];
        var endLine = lines[1];
        var startLocation = null;
        var endLocation = null;
        var finialGeo = {
            type: 'LineString',
            coordinates: []
        };
        if (startLine) {
            startLine = this.geometryFactory.fromGeojson(startLine);
            startLine = startLine.reverse();
            var startLines = startLine.splitByLength(length);
            startLocation = startLines[0].reverse();
            startLocation = this.geometryFactory.toGeojson(startLocation);
            for (var i = 0; i < startLocation.coordinates.length; i++) {
                finialGeo.coordinates.push(startLocation.coordinates[i]);
            }
        }
        if (endLine) {
            endLine = this.geometryFactory.fromGeojson(endLine);
            var endLines = endLine.splitByLength(length);
            endLocation = endLines[0];
            endLocation = this.geometryFactory.toGeojson(endLocation);
            if (startLocation) {
                for (var m = 1; m < endLocation.coordinates.length; m++) {
                    finialGeo.coordinates.push(endLocation.coordinates[m]);
                }
            } else {
                for (var n = 0; n < endLocation.coordinates.length; n++) {
                    finialGeo.coordinates.push(endLocation.coordinates[n]);
                }
            }
        }
        return finialGeo;
    }

});
