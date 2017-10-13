/**
 * Created by wuzhen on 2017/4/9.
 * 框选线，适用于cfr道路
 */

fastmap.uikit.relationEdit.CrfObjectTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.isPassedShiftKey = false;
        this.name = 'CrfObjectTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.removeFeatureSelFilter(); // crf作业时需要跨大区作业

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['RDLINK', 'RDINTER', 'RDROAD'];
        this.selectedFeatures = [];

        this.refresh();
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
    },

    resetSelectFeedback: function () {
        if (!this.selectFeedback) {
            return;
        }

        this.selectFeedback.clear();

        if (!this.isPassedShiftKey) {
            if (this.isDragging && this.startPoint && this.endPoint) {
                var box = this.getSelectBox(this.startPoint, this.endPoint);
                var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
                this.selectFeedback.add(box, symbol);
            }
        } else {
            this.startPoint = null;
            this.endPoint = null;
        }

        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        if (this.isPassedShiftKey) {
            this.setMouseInfo('请在地图点击重设代表点!');
        } else {
            this.setMouseInfo('请在地图上框选或者空格保存!');
        }
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult && (this.editResult.links.length > 0 || this.editResult.inters.length > 0 || this.editResult.roads.length > 0)) {
            var geometry = {
                type: 'MultiPoint',
                coordinates: []
            };
            var editObj = this.removeRepeatLink(this.editResult);
            var links = editObj.links;
            var inters = editObj.inters;
            var roads = editObj.roads;

            this.addRdLinkFeedback(links);
            this.addInterFeedback(inters);
            this.addRoadsFeedback(roads);
            this.addOjbectFeedback(this.editResult.coordinate);

            geometry.coordinates = this.getPoints(editObj);
            this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
            var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
            var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
            var buffer = this.geometryAlgorithm.buffer(convexHull, 10);
            this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
            var geographyGeometry = this.geojsonTransform.convertGeometry(buffer); //
            // 绘制包络线
            var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
            this.defaultFeedback.add(geographyGeometry, bufferSymbol);
        }

        this.refreshFeedback();
    },

    addRdLinkFeedback: function (links) {
        var linkLen = links.length;
        if (linkLen > 0) {
            for (var i = 0; i < linkLen; ++i) {
                var feature = links[i];
                var linkSymbol = this.symbolFactory.getSymbol('ls_link');
                this.defaultFeedback.add(feature.geometry, linkSymbol);
            }
        }
    },

    addInterFeedback: function (inters) {
        var interLen = inters.length;
        var i,
            j;
        if (interLen > 0) {
            for (i = 0; i < interLen; ++i) {
                var interFeature = inters[i];
                var obj = this.multiObjToObjs(interFeature);
                var points = obj.points;
                var links = obj.links;
                for (j = 0; j < points.length; j++) {
                    var interPointSymbol = this.symbolFactory.getSymbol('pt_node_cross');
                    this.defaultFeedback.add(points[j].geometry, interPointSymbol);
                }
                for (j = 0; j < links.length; j++) {
                    var interLinkSymbol = this.symbolFactory.getSymbol('ls_link');
                    this.defaultFeedback.add(links[j].geometry, interLinkSymbol);
                }
            }
        }
    },

    addRoadsFeedback: function (roads) {
        var roadsLen = roads.length;
        var i,
            j;
        if (roadsLen > 0) {
            for (i = 0; i < roadsLen; ++i) {
                var interFeature = roads[i];
                var obj = this.multiObjToObjs(interFeature);
                var links = obj.links;
                for (j = 0; j < links.length; j++) {
                    var interLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
                    this.defaultFeedback.add(links[j].geometry, interLinkSymbol);
                }
            }
        }
    },

    addOjbectFeedback: function (coordinate) {
        if (coordinate) {
            var interLinkSymbol = this.symbolFactory.getSymbol('pt_poiCreateLoc');
            this.defaultFeedback.add({
                type: 'Point',
                coordinates: [coordinate.longitude, coordinate.latitude]
            }, interLinkSymbol);
        }
    },

    multiObjToObjs: function (feature) {
        var obj = {
            points: [],
            links: []
        };
        if (feature.geometry.type === 'GeometryCollection') {
            var gs = feature.geometry.geometries;
            for (var i = 0; i < gs.length; i++) {
                if (gs[i].type === 'MultiPoint') {
                    obj.points = obj.points.concat(this.multiPointToPoints(gs[i].coordinates));
                } else if (gs[i].type === 'MultiLineString') {
                    obj.links = obj.links.concat(this.multiLineToLines(gs[i].coordinates));
                }
            }
        }
        return obj;
    },

    multiPointToPoints: function (features) {
        var points = [];
        for (var i = 0; i < features.length; i++) {
            points.push({
                geometry: {
                    type: 'Point',
                    coordinates: features[i]
                }
            });
        }
        return points;
    },

    multiLineToLines: function (features) {
        var lines = [];
        for (var i = 0; i < features.length; i++) {
            lines.push({
                geometry: {
                    type: 'LineString',
                    coordinates: features[i]
                }
            });
        }
        return lines;
    },

    /**
     * 获取点和线上点的集合
     * @param features
     * @returns {Array}
     */
    getPoints: function (features) {
        var i,
            j,
            k,
            len;
        var coordinates = [];
        var links = features.links;
        var inters = features.inters;
        var roads = features.roads;
        for (i = 0, len = links.length; i < len; i++) {
            coordinates = coordinates.concat(links[i].geometry.coordinates);
        }
        for (i = 0, len = inters.length; i < len; i++) {
            var temp = inters[i].geometry.geometries;
            for (j = 0; j < temp.length; j++) {
                if (temp[j].type === 'MultiPoint') {
                    coordinates = coordinates.concat(temp[j].coordinates);
                } else if (temp[j].type === 'MultiLineString') {
                    var p = temp[j].coordinates;
                    for (k = 0; k < p.length; k++) {
                        coordinates = coordinates.concat(p[k]);
                    }
                }
            }
        }
        for (i = 0, len = roads.length; i < len; i++) {
            var road = roads[i].geometry.geometries;
            for (j = 0; j < road.length; j++) {
                var rd = road[j].coordinates;
                for (k = 0; k < rd.length; k++) {
                    coordinates = coordinates.concat(rd[k]);
                }
            }
        }
        // eslint-disable-next-line no-undef
        coordinates = FM.Util.uniqueWith(coordinates, _.isEqual);
        return coordinates;
    },

    onLeftButtonDown: function (event) {
        this.startPoint = this.mousePoint;
        this.isDragging = true;

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        if (event.originalEvent.shiftKey) {
            this.isPassedShiftKey = true;
        } else {
            this.isPassedShiftKey = false;
        }
        return true;
    },
    onLeftButtonUp: function (event) {
        if (event.originalEvent.shiftKey) {
            return this.setMainPoint(event);
        }
        return this.setRdOjbect(event);
    },

    setMainPoint: function (event) {
        if (this.editResult &&
            (this.editResult.links.length > 0 || this.editResult.inters.length > 0 || this.editResult.roads.length > 0)) {
            var newEditResult = FM.Util.clone(this.editResult);
            var currentPoint = this.latlngToPoint(event.latlng);
            newEditResult.coordinate = {};
            newEditResult.coordinate.longitude = currentPoint.coordinates[0];
            newEditResult.coordinate.latitude = currentPoint.coordinates[1];
            this.createOperation('框选cfr对象', newEditResult);
        }
        return true;
    },

    setRdOjbect: function (event) {
        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;

        var box = this.getSelectBox(this.startPoint, this.endPoint);

        var features = this.featureSelector.selectByGeometry(box, this.selectTypes);

        if (this.editResult.isCreate) {
            features = this.classifyFeatures(features);
        } else {
            features = this.filterRdRoadAndRdLinks(features);
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyLinks(features);
        } else {
            this.replaceLinks(features);
        }

        return true;
    },

    modifyLinks: function (features) {
        var newEditResult = FM.Util.clone(this.editResult);

        newEditResult.links = this.diffByPropertiesid(features.links, newEditResult.links);
        newEditResult.inters = this.diffByPropertiesid(features.inters, newEditResult.inters);
        newEditResult.roads = this.diffByPropertiesid(features.roads, newEditResult.roads);

        this.setCenter(newEditResult);

        this.createOperation('修改cfr对象', newEditResult);
    },

    diffByPropertiesid: function (features, obj) {
        var addItems = FM.Util.differenceBy(features, obj, 'properties.id');
        var remainItems = FM.Util.differenceBy(obj, features, 'properties.id');
        return remainItems.concat(addItems);
    },

    replaceLinks: function (features) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.links = features.links;
        newEditResult.inters = features.inters;
        newEditResult.roads = features.roads;

        this.setCenter(newEditResult);

        this.createOperation('框选cfr对象', newEditResult);
    },

    /**
     * 获取CRFObject的重心点
     * @param newEditResult
     */
    setCenter: function (newEditResult) {
        var points = this.getPoints(newEditResult);
        newEditResult.coordinate = null;
        if (points.length > 0) {
            newEditResult.coordinate = {};
            var geometry = this.pointsToGeoJson(points);
            var s = this.geometryAlgorithm.centroid(geometry);
            newEditResult.coordinate.longitude = s.coordinates[0];
            newEditResult.coordinate.latitude = s.coordinates[1];
        }
    },

    pointsToGeoJson: function (points) {
        var geometry = {
            geometries: [],
            type: 'GeometryCollection'
        };
        for (var i = 0; i < points.length; i++) {
            geometry.geometries.push({
                type: 'Point',
                coordinates: points[i]
            });
        }
        return geometry;
    },

    /**
     *
     * @param dataList
     * @returns {{links: Array, inters: Array, roads: Array}}
     */
    classifyFeatures: function (dataList) {
        var i,
            j,
            len;
        var rdLinkList = [];
        var rdInterList = [];
        var rdRoadList = [];
        var usedLinkIdList = [];
        for (i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].properties.geoLiveType === 'RDLINK') {
                rdLinkList.push(dataList[i]);
            } else if (dataList[i].properties.geoLiveType === 'RDINTER') {
                rdInterList.push(dataList[i]);
                for (j = 0; j < dataList[i].properties.links.length; j++) {
                    usedLinkIdList.push(dataList[i].properties.links[j].linkId);
                }
            } else if (dataList[i].properties.geoLiveType === 'RDROAD') {
                rdRoadList.push(dataList[i]);
                for (j = 0; j < dataList[i].properties.links.length; j++) {
                    usedLinkIdList.push(dataList[i].properties.links[j].linkId);
                }
            }
        }

        usedLinkIdList = FM.Util.unique(usedLinkIdList);

        for (i = 0; i < rdLinkList.length; i++) { // 排除掉已经做过crfRoad的rdLink
            var linkId = rdLinkList[i].properties.id;
            if (usedLinkIdList.indexOf(linkId) > -1) {
                rdLinkList.splice(i, 1);
                i--;
            }
        }
        var obj = {
            links: rdLinkList,
            inters: rdInterList,
            roads: rdRoadList
        };
        return obj;
    },

    /**
     * 从links中移除掉crfInter和crfRoad中存在的link
     * @param feature
     * @returns {{links: *, inters: (Array|*|null), roads: (Array|*|null)}}
     */
    removeRepeatLink: function (feature) {
        feature = FM.Util.clone(feature);
        var i,
            j;
        var links = feature.links;
        var inters = feature.inters;
        var roads = feature.roads;
        var interLinkIds = [];
        for (i = 0; i < inters.length; i++) {
            var interLinks = inters[i].properties.links;
            for (j = 0; j < interLinks.length; j++) {
                interLinkIds.push(interLinks[j].linkId);
            }
        }
        for (i = 0; i < roads.length; i++) {
            var roadLinks = roads[i].properties.links;
            for (j = 0; j < roadLinks.length; j++) {
                interLinkIds.push(roadLinks[j].linkId);
            }
        }
        interLinkIds = FM.Util.unique(interLinkIds);

        for (i = 0; i < links.length; i++) { // 排除掉已经做过crfRoad的rdLink
            var linkId = links[i].properties.linkPid;
            if (interLinkIds.indexOf(linkId) > -1) {
                links.splice(i, 1);
                i--;
            }
        }

        var obj = {
            links: links,
            inters: inters,
            roads: roads
        };
        return obj;
    },

    /**
     *
     * @param linkList
     * @returns {Array}
     */
    filterRdRoadAndRdLinks: function (dataList) {
        var i,
            len;
        var rdLinkList = [];
        var rdInterList = [];
        var rdRoadList = [];
        var interAndRoadLinkIds = [];
        for (i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].properties.geoLiveType === 'RDLINK') {
                rdLinkList.push(dataList[i]);
            } else if (dataList[i].properties.geoLiveType === 'RDINTER') {
                rdInterList.push(dataList[i]);
                interAndRoadLinkIds = interAndRoadLinkIds.concat(this.getInterLinks(dataList[i]));
            } else if (dataList[i].properties.geoLiveType === 'RDROAD') {
                rdRoadList.push(dataList[i]);
                interAndRoadLinkIds = interAndRoadLinkIds.concat(this.getRoadLinks(dataList[i]));
            }
        }
        interAndRoadLinkIds = FM.Util.unique(interAndRoadLinkIds);

        for (i = 0; i < rdLinkList.length; i++) { // 排除掉已经做过crfRoad的rdLink
            var linkId = rdLinkList[i].properties.id;
            if (interAndRoadLinkIds.indexOf(linkId) > -1) {
                rdLinkList.splice(i, 1);
                i--;
            }
        }
        var obj = {
            links: rdLinkList,
            inters: rdInterList,
            roads: rdRoadList
        };
        return obj;
    },

    /**
     * 获取rdInter中包含的linkId
     * @param inter
     */
    getInterLinks: function (inter) {
        var arr = [];
        var links = inter.properties.links;
        for (var i = 0; i < links.length; i++) {
            arr.push(links[i].linkId);
        }
        return arr;
    },

    /**
     * 获取rdRoad中包含的linkId
     * @param inter
     */
    getRoadLinks: function (road) {
        var arr = [];
        var links = road.properties.links;
        for (var i = 0; i < links.length; i++) {
            arr.push(links[i].linkId);
        }
        return arr;
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    }
});
