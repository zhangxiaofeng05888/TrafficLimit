/**
 * Created by wuzhen on 2017/7/3.
 */

fastmap.uikit.complexEdit.LinksAutoBreakTool = fastmap.uikit.complexEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'LinksAutoBreakTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.resetStatus.apply(this, arguments);

        this.editResult = null;
        this.snapActor = null;
        this.startPoint = null;
        this.selectBox = null;
        this.isDragging = false;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetMouseInfo: function () {
        if (this.editResult.operation == 'BoxSelect') {
            this.setMouseInfo('请框选交叉点');
            return;
        }

        if (this.editResult.operation == 'SelectCross') {
            this.setMouseInfo('请选择一个交叉点');
            return;
        }

        if (this.editResult.operation == 'Save') {
            this.setMouseInfo('请按ESC重做或者按空格键保存');
            return;
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        if (this.editResult.operation == 'SelectCross') {
            this.installCrossPointSnapActor();
            return;
        }
    },

    installCrossPointSnapActor: function () {
        var points = [];
        for (var i = 0; i < this.editResult.crossPoints.length; i++) {
            points.push({
                index: i,
                geometry: this.editResult.crossPoints[i].point
            });
        }
        this.snapActor = this.createGivenObjectSnapActor(points);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.operation == 'SelectCross') {
            this.feedbackCrossPoints();
        } else if (this.editResult.operation == 'Save') {
            this.feedbackLinks();
        }

        this.refreshFeedback();
    },

    feedbackCrossPoints: function () {
        var points = this.editResult.crossPoints;
        var symbol = this.symbolFactory.getSymbol('relationEdit_gsc_candidates');
        for (var i = 0; i < points.length; i++) {
            this.defaultFeedback.add(points[i].point, symbol);
        }
    },

    feedbackLinks: function () {
        var links = this.editResult.parts;
        var symbol;
        for (var i = 0; i < links.length; i++) {
            symbol = this.symbolFactory.getSymbol('ls_link_part_0');
            this.defaultFeedback.add(links[i].segment, symbol);
        }
    },

    resetSelectFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.selectBox) {
            var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.defaultFeedback.add(this.selectBox, symbol);
        }

        this.refreshFeedback();
    },

    onLeftButtonDown: function (event) {
        if (this.editResult.operation == 'BoxSelect') {
            this.startPoint = this.mousePoint;
            this.isDragging = true;
        }

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (this.isDragging) {
            this.endPoint = this.mousePoint;
            this.selectBox = this.getSelectBox(this.startPoint, this.endPoint);

            this.resetSelectFeedback();
        } else if (this.editResult.operation == 'SelectCross') {
            this.snapController.snap(this.mousePoint);
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!this.isDragging) {
            return false;
        }

        var box = this.selectBox;
        // 鼠标抬起时清理选择框
        this.selectBox = null;
        this.resetSelectFeedback();

        var features = this.featureSelector.selectByGeometry(box, this.editResult.selectTypes);

        if (features.length > 0) {
            var crossPoints = this.getCrossPoints(features, box);

            if (crossPoints.length > 0) {
                this.editResult.selectBox = box;
                this.editResult.crossPoints = crossPoints;

                if (crossPoints.length === 1) {
                    this.onSelectCrossPoint(0);
                } else {
                    var newEditResult = FM.Util.clone(this.editResult);
                    newEditResult.operation = 'SelectCross';
                    this.createOperation('选中交叉点', newEditResult);
                }
            }
        }

        return true;
    },

    onLeftButtonClick: function (event) {
        if (this.isDragging == true) {
            this.isDragging = false;
            return false;
        }
        if (!(this.editResult.operation == 'SelectCross')) {
            return false;
        }
        if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (this.editResult.operation == 'SelectCross') {
            this.onSelectCrossPoint(res.feature.index);
        }

        return true;
    },

    // 判断两个线是否相交于端点
    _isTouchEndPoint: function (line1, line2, crossPointFeature) {
        var line1SnodePoint;
        var line1EnodePoint;
        var line2SnodePoint;
        var line2EnodePoint;
        var crossPoint = crossPointFeature.coordinates.join(',');
        var len;
        var coor1 = line1.geometry.coordinates;
        var coor2 = line1.geometry.coordinates;
        if (coor1.length > 2) {
            len = coor1.length;
            line1SnodePoint = coor1[0].join(',');
            line1EnodePoint = coor1[len - 1].join(',');
        } else {
            line1SnodePoint = coor1[0].join(',');
            line1EnodePoint = coor1[1].join(',');
        }
        if (coor2.length > 2) {
            len = coor2.length;
            line2SnodePoint = coor2[0].join(',');
            line2EnodePoint = coor2[len - 1].join(',');
        } else {
            line2SnodePoint = coor2[0].join(',');
            line2EnodePoint = coor2[1].join(',');
        }

        if ((line1SnodePoint === crossPoint || line1EnodePoint === crossPoint) && (line2SnodePoint === crossPoint || line2EnodePoint === crossPoint)) {
            return true;
        }
        return false;
    },

    // 合并两个数组，将featList2中满足条件的数据合并到featList1中
    _mergeFeatureList: function (featList1, featList2) {
        var i,
            j,
            f;
        var temp = [];
        for (i = 0; i < featList2.length; i++) {
            f = true;
            for (j = 0; j < featList1.length; j++) {
                if (featList1[j].type == featList2[i].type && featList1[j].pid == featList2[i].pid) {
                    // 去重两种数据：1.完全相同；2.同一要素的相邻的折线段
                    if (Math.abs(featList1[j].seqNum - featList2[i].seqNum) <= 1) {
                        f = false;
                        break;
                    }
                }
            }
            if (f) {
                temp.push(featList2[i]);
            }
        }
        if (temp.length > 0) {
            Array.prototype.push.apply(featList1, temp);
        }
    },

    getCrossPoints: function (features, selectBox) {
        var segments;
        var i,
            j,
            k;
        var linkSegments = [];
        for (i = 0; i < features.length; i++) {
            segments = this.uikitUtil.splitToSegments(features[i].geometry); // 将link按照相邻的形状点，打断成多个直线段
            for (j = 0; j < segments.length; j++) {
                linkSegments.push({
                    pid: features[i].properties.id,
                    type: features[i].properties.geoLiveType,
                    feature: features[i],
                    segment: segments[j],
                    seqNum: j
                });
            }
        }

        var intersectList = [];
        var interPoint;
        // 计算线段的交点
        for (i = 0; i < linkSegments.length - 1; i++) {
            for (j = i + 1; j < linkSegments.length; j++) {
                // 相同要素不进行交点计算(排除自相交关系)
                if (linkSegments[i].pid !== linkSegments[j].pid) {
                    interPoint = this.geometryAlgorithm.intersection(linkSegments[i].segment, linkSegments[j].segment);
                    var flag = this._isTouchEndPoint(linkSegments[i].feature, linkSegments[j].feature, interPoint);// 是否相交于端点
                    if (interPoint.type == 'Point' && !flag) {
                        intersectList.push({
                            point: interPoint,
                            data: [linkSegments[i], linkSegments[j]]
                        });
                    }
                }
            }
        }

        // 从交点数据列表中去掉未被框选的
        for (i = intersectList.length - 1; i >= 0; i--) {
            if (!this.geometryAlgorithm.contains(selectBox, intersectList[i].point)) {
                intersectList.splice(i, 1);
            }
        }

        // 合并交点相同（相近）的数据
        for (i = 0; i < intersectList.length - 1; i++) {
            if (!intersectList[i].merged) {
                for (j = i + 1; j < intersectList.length; j++) {
                    if (!intersectList[j].merged) {
                        if (this.uikitUtil.isSamePoint(intersectList[i].point, intersectList[j].point)) {
                            this._mergeFeatureList(intersectList[i].data, intersectList[j].data);
                            intersectList[j].merged = true;
                        }
                    }
                }
            }
        }

        // 从交点数据列表中去掉被合并的
        for (i = intersectList.length - 1; i >= 0; i--) {
            if (intersectList[i].merged) {
                intersectList.splice(i, 1);
            }
        }

        return intersectList;
    },

    _bulidCrossLinks: function (crossPointObj) {
        // 删掉同一link上连续的两条线段的后一条（处理第三条线段与同一link的连续两条线段相交于挂接点的情况）
        var i,
            j;
        var seg1,
            seg2;
        for (i = 0; i < crossPointObj.data.length - 1; i++) {
            seg1 = crossPointObj.data[i];
            for (j = i + 1; j < crossPointObj.data.length; j++) {
                seg2 = crossPointObj.data[j];
                if (seg1.pid == seg2.pid && seg1.type == seg2.tpye && seg1.seqNum + 1 == seg2.seqNum) {
                    crossPointObj.data.splice(j, 1);
                    break;
                }
            }
        }

        return this.uikitUtil.splitLinks(crossPointObj.point, crossPointObj.data);
    },

    onSelectCrossPoint: function (index) {
        var cross = this.editResult.crossPoints[index];

        var crossLink = this._bulidCrossLinks(cross);

        var nodes = this._getNodeByCrossPoint(cross.point);

        var nodeId = 0;
        if (nodes.length > 1) {
            this.setCenterInfo('交点2米内存在多个node点，不允许打断', 2000);
            return;
        } else if (nodes.length === 1) {
            nodeId = nodes[0].properties.id;
        }

        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.point = cross.point;
        newEditResult.parts = crossLink;
        newEditResult.nodePid = nodeId;
        newEditResult.operation = 'Save';
        this.createOperation('选中要打断的点', newEditResult);
    },

    /**
     * 在以point为圆心半径为2米的圆内查找RDNODE
     * @param point
     * @returns {*}
     * @private
     */
    _getNodeByCrossPoint: function (point) {
        var self = this;
        this.geojsonTransform.setEnviroment(this.map, null, function (map, tile, coordinates) {
            return self.geometryAlgorithm.proj4Transform.wgs84ToXian80(coordinates);
        });
        var pixelGeometry = this.geojsonTransform.convertGeometry(point);
        var geometry = this.geometryAlgorithm.buffer(pixelGeometry, 2); //
        this.geojsonTransform.setEnviroment(this.map, null, function (map, tile, coordinates) {
            return self.geometryAlgorithm.proj4Transform.xian80ToWGS84(coordinates);
        });
        var geographyGeometry = this.geojsonTransform.convertGeometry(geometry);

        var features = this.featureSelector.selectByGeometry(geographyGeometry, ['RDNODE']);

        return features;
    },

    getSelectBox: function (point1, point2) {
        var geojson = {
            type: 'GeometryCollection',
            geometries: [point1, point2]
        };
        var bbox = this.geometryAlgorithm.bbox(geojson);
        var polygon = this.geometryAlgorithm.bboxToPolygon(bbox);
        return polygon;
    }
});
