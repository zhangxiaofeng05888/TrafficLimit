/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.GradeSeperateCrossTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'GradeSeperateCrossTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

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

        if (this.editResult.operation == 'SortLink') {
            this.setMouseInfo('请点击组成线调整层级，或者按空格键保存');
            return;
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        if (this.editResult.operation == 'SelectCross') {
            this.installCrossPointSnapActor();
            return;
        }

        if (this.editResult.operation == 'SortLink') {
            this.installLinkSnapActor();
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

    installLinkSnapActor: function () {
        var links = [];
        for (var i = 0; i < this.editResult.parts.length; i++) {
            links.push({
                index: i,
                geometry: this.editResult.parts[i].segment
            });
        }
        this.snapActor = this.createGivenObjectSnapActor(links);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.operation == 'SelectCross') {
            this.feedbackCrossPoints();
        } else if (this.editResult.operation == 'SortLink') {
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
            symbol = this.symbolFactory.getSymbol('ls_link_part_' + links[i].zlevel);
            this.defaultFeedback.add(links[i].segment, symbol);
        }
    },

    resetSelectFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.isDragging && this.startPoint && this.endPoint) {
            var box = this.getSelectBox(this.startPoint, this.endPoint);
            var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.defaultFeedback.add(box, symbol);
        }

        this.refreshFeedback();
    },

    onLeftButtonDown: function (event) {
        if (this.editResult.operation == 'BoxSelect') {
            this.startPoint = this.mousePoint;
            this.endPoint = this.mousePoint;
            this.isDragging = true;
        }

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (this.isDragging) {
            this.endPoint = this.mousePoint;
            this.resetSelectFeedback();
        } else if (this.editResult.operation == 'SelectCross' || this.editResult.operation == 'SortLink') {
            this.snapController.snap(this.mousePoint);
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!this.isDragging) {
            return false;
        }

        var box = this.getSelectBox(this.startPoint, this.endPoint);

        var features = this.featureSelector.selectByGeometry(box, this.editResult.featureTypes);

        if (features.length > 0) {
            var crossPoints = this.getCrossPoints(features, box);

            if (crossPoints.length > 0) {
                var newEditResult = FM.Util.clone(this.editResult);
                newEditResult.selectBox = box;
                newEditResult.crossPoints = crossPoints;
                newEditResult.operation = 'SelectCross';
                this.createOperation('框选立交点', newEditResult);

                if (crossPoints.length === 1) {
                    this.onSelectCrossPoint(0);
                }
            }
        }

        return true;
    },

    _splitToSegments: function (geometry) {
        var segments = [];
        if (geometry.coordinates.length < 2) {
            return segments;
        }
        for (var i = 0; i < geometry.coordinates.length - 1; i++) {
            segments.push({
                type: 'LineString',
                coordinates: geometry.coordinates.slice(i, i + 2)
            });
        }
        return segments;
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
            segments = this.uikitUtil.splitToSegments(features[i].geometry);
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
                // 同一个要素link的相邻的两条线段不进行相交计算
                if (!(linkSegments[i].pid == linkSegments[j].pid && linkSegments[i].type == linkSegments[j].type && Math.abs(linkSegments[i].seqNum - linkSegments[j].seqNum) === 1)) {
                    interPoint = this.geometryAlgorithm.intersection(linkSegments[i].segment, linkSegments[j].segment);
                    if (interPoint.type == 'Point') {
                        // interPoint.coordinates[0] = interPoint.coordinates[0].toFixed(5);
                        // interPoint.coordinates[1] = interPoint.coordinates[1].toFixed(5);
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

    onLeftButtonClick: function (event) {
        if (this.isDragging == true) {
            this.isDragging = false;
            return false;
        }
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (this.editResult.operation === 'SelectCross') {
            return this.onSelectCrossPoint(res.feature.index);
        } else if (this.editResult.operation === 'SortLink') {
            return this.onSelectLink(res);
        }

        return false;
    },

    _bulidCrossLinks: function (crossPointObj) {
        // 按照要素类型、pid、线段序号排序
        crossPointObj.data.sort(function (a, b) {
            if (a.type == b.type) {
                if (a.pid == b.pid) {
                    return a.seqNum > b.seqNum ? 1 : -1;
                }
                return a.pid > b.pid ? 1 : -1;
            }
            return a.type > b.type ? 1 : -1;
        });

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

        // 以下为处理平交的情况
        var cp = cross.point;
        var p;
        for (var i = 0; i < crossLink.length; i++) {
            p = this.uikitUtil.createPoint(crossLink[i].feature.geometry.coordinates[0]);
            crossLink[i].featureType = crossLink[i].feature.properties.geoLiveType;
            if (this.uikitUtil.isSamePoint(cp, p)) { // 交点为link起点
                crossLink[i].startEnd = 1;
                crossLink[i].crossNode = crossLink[i].feature.properties.snode;
            } else {
                p = this.uikitUtil.createPoint(crossLink[i].feature.geometry.coordinates[crossLink[i].feature.geometry.coordinates.length - 1]);
                if (this.uikitUtil.isSamePoint(cp, p)) { // 交点为link终点
                    crossLink[i].startEnd = 2;
                    crossLink[i].crossNode = crossLink[i].feature.properties.enode;
                } else {
                    crossLink[i].startEnd = 0;
                    crossLink[i].crossNode = 0;
                }
            }
        }

        // 按照是否是同类要素、是否平交排序，平交的排在最底层
        crossLink.sort(function (a, b) {
            if (a.featureType !== b.featureType) {
                return a.featureType < b.featureType ? 1 : -1;
            }

            return a.crossNode < b.crossNode ? 1 : -1;
        });

        // 同类型的平交的link的zlevel赋为相同值
        var zlevel = 0;
        crossLink[0].zlevel = zlevel;
        var last = crossLink[0];
        for (i = 1; i < crossLink.length; i++) {
            if (crossLink[i].crossNode === 0 || crossLink[i].featureType !== last.featureType || crossLink[i].crossNode !== last.crossNode) {
                zlevel++;
            }
            crossLink[i].zlevel = zlevel;
            last = crossLink[i];
        }

        if (zlevel === 0) {
            this.setCenterInfo('只有一个层级，不能创建立交', 1000);
            if (this.editResult.crossPoints.length === 1) {
                this.operationController.undo();
            }
            return false;
        }

        // 以下都为处理隧道的情况
        var sdLevel = [];
        for (i = 0; i < crossLink.length; i++) {
            if (crossLink[i].geoLiveType === 'RDLINK' && crossLink[i].feature.properties.form.split(';').indexOf('31') >= 0) {
                if (sdLevel.indexOf(crossLink[i].zlevel) < 0) {
                    sdLevel.push(crossLink[i].zlevel);
                }
            }
        }

        sdLevel.forEach(l => {
            var a = crossLink.filter(o => o.zlevel === l);
            var b = crossLink.filter(o => o.zlevel < l);
            a.forEach(x => {
                x.zlevel = 0;
            });
            b.forEach(x => {
                x.zlevel += 1;
            });
        });

        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.point = cross.point;
        newEditResult.parts = crossLink;
        newEditResult.operation = 'SortLink';
        this.createOperation('选中立交点', newEditResult);

        return true;
    },

    onSelectLink: function (snapObj) {
        var index = snapObj.feature.index;
        var newEditResult = FM.Util.clone(this.editResult);

        var maxLevel = newEditResult.parts[newEditResult.parts.length - 1].zlevel;
        var currLevel = newEditResult.parts[index].zlevel;

        var i;

        if (maxLevel === 0) {
            this.setCenterInfo('只有一个层级，不需要调整', 1000);
            return false;
        }

        if (currLevel < maxLevel) {
            for (i = 0; i < newEditResult.parts.length; i++) {
                if (newEditResult.parts[i].zlevel === currLevel) {
                    newEditResult.parts[i].zlevel++;
                } else if (newEditResult.parts[i].zlevel === (currLevel + 1)) {
                    newEditResult.parts[i].zlevel--;
                }
            }
        } else if (currLevel > 0) {
            for (i = 0; i < newEditResult.parts.length; i++) {
                if (newEditResult.parts[i].zlevel === currLevel) {
                    newEditResult.parts[i].zlevel--;
                } else if (newEditResult.parts[i].zlevel === (currLevel - 1)) {
                    newEditResult.parts[i].zlevel++;
                }
            }
        }
        newEditResult.parts.sort(function (a, b) {
            return a.zlevel > b.zlevel ? 1 : -1;
        });

        this.createOperation('调整立交层级', newEditResult);

        return true;
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
