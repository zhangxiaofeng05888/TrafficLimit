/**
 * Created by linglong on 2016/12/8.
 * 同一点
 */
fastmap.uikit.relationEdit.SamePointRelationTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.name = 'SamePointRelationTool';

        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
        this.isQueried = false;

        this.selectTypes = null;
    },

    startup: function () {
        this.resetStatus();
        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['RDNODE', 'ADNODE', 'ZONENODE', 'LUNODE'];

        this.eventController.on(L.Mixin.EventTypes.CTRLPANELSELECTED, this.highLightselectedFeatures);
        this.eventController.on(L.Mixin.EventTypes.ADDRELATION, this.doRelate);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.shutdown.apply(this, arguments);

        this.eventController.off(L.Mixin.EventTypes.CTRLPANELSELECTED, this.highLightselectedFeatures);
        this.eventController.off(L.Mixin.EventTypes.ADDRELATION, this.doRelate);
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'RdSameNodePanel' });

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.resetStatus.apply(this, arguments);

        this.selectFeedback = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
        this.isQueried = false;

        this.selectTypes = null;
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
        if (!this.editResult.relationFeatures.length) {
            this.isQueried = false;
            this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'RdSameNodePanel' });
        }
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetSelectFeedback: function () {
        if (!this.selectFeedback) {
            return;
        }
        this.selectFeedback.clear();
        if (this.startPoint && this.endPoint) {
            var box = this.getSelectBox(this.startPoint, this.endPoint);
            var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.selectFeedback.add(box, symbol);
        }
        this.refreshFeedback();
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        this.selectFeedback.clear();

        var length = this.editResult.relationFeatures.length;
        if (this.editResult && length) {
            var geometry = {
                type: 'MultiPoint',
                coordinates: []
            };
            for (var i = 0; i < length; ++i) {
                var temp = this.editResult.relationFeatures[i];
                var feature = this.featureSelector.selectByFeatureId(temp.id, temp.featType);
                var nodeSymbol;
                if (temp.isMain) {
                    nodeSymbol = this.symbolFactory.getSymbol('relationEdit_same_node_main');
                } else if (temp.checked) {
                    nodeSymbol = this.symbolFactory.getSymbol('relationEdit_same_node_selected');
                } else {
                    nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
                }
                this.defaultFeedback.add(feature.geometry, nodeSymbol);
                geometry.coordinates.push(feature.geometry.coordinates);
            }
            // 绘制包络线
            this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
            var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
            var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
            var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
            this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
            var geographyGeometry = this.geojsonTransform.convertGeometry(buffer);
            var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
            this.defaultFeedback.add(geographyGeometry, bufferSymbol);
        }
        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        if (this.isQueried && !this.editResult.relationFeatures.length) {
            this.setMouseInfo('没有符合条件的数据');
            return;
        }
        if (!this.editResult.relationFeatures.length) {
            this.setMouseInfo('请框选制作同一点数据');
            return;
        }
        this.setMouseInfo('');
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }
        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        return true;
    },

    onLeftButtonUp: function (event) {
        this.isDragging = false;
        if (!this.endPoint || (this.startPoint.coordinates[0] == this.endPoint.coordinates[0] && this.startPoint.coordinates[1] == this.endPoint.coordinates[1])) { //
            return false;
        }
        var box = this.getSelectBox(this.startPoint, this.endPoint);
        var param = {
            types: ['RDNODE', 'ADNODE', 'ZONENODE', 'LUNODE', 'RWNODE'],
            wkt: box
        };
        var _self = this;
        this.dataService.queryBySpatial(param).then(function (res) {
            for (var i in res) {
                if (res[i].length) {
                    _self.isQueried = true;
                }
            }
            this.startPoint = null;
            this.endPoint = null;
            var arr = [];
            // 去除形态为图廓点的道路点.
            _self.filterByKind(res.RDNODE, [], 2);
            _self.compleData(res.RDNODE, arr, 'RDNODE');
            // 包含对应的link种别为1 2 3的node点 图廓点.
            _self.filterByKind(res.ADNODE, ['1', '2', '3'], 1);
            _self.compleData(res.ADNODE, arr, 'ADNODE');
            _self.filterByKind(res.RWNODE, [], 1);
            _self.compleData(res.RWNODE, arr, 'RWNODE');
            // 包含对应的link种别为1 2 的node点 图廓点.
            _self.filterByKind(res.ZONENODE, ['1', '2'], 1);
            var sortArr = _self.sortByKind(res.ZONENODE, ['2', '1']);
            _self.compleData(sortArr, arr, 'ZONENODE');
            // 包含对应的link种别为12345672223 的node点 图廓点.
            _self.filterByKind(res.LUNODE, ['21', '1', '2', '3', '4', '5', '6', '7', '22', '23'], 1);
            sortArr = _self.sortByKind(res.LUNODE, ['21']);
            //  包含bua 边界线的和不包含bua 边界线的算两种要素
            _self.compleData(sortArr, arr, 'LUNODE', '21');

            if (arr.length) {
                _self.editResult.relationFeatures = arr;
                _self.createOperation('框选制作同一点的对象', _self.editResult);
                _self.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'RdSameNodePanel', data: arr });
            } else {
                _self.editResult.relationFeatures = arr;
                _self.createOperation('框选制作同一点的对象', _self.editResult);
            }
        });
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
    },

    // 剔除掉种别不在kindArr数组中的数据 剔除掉已经做过同一点的数据 剔除掉图廓点
    filterByKind: function (srcArr, kindArr, form) {
        if (srcArr) {
            for (var j = srcArr.length - 1; j >= 0; j--) {
                if (srcArr[j].m.sameNode) { // 已经是同一点了
                    srcArr.splice(j, 1);
                } else if (srcArr[j].m.form == form) {
                    srcArr.splice(j, 1);
                } else if (kindArr.length > 0) {
                    var kinds = srcArr[j].m.a[0].kinds.split(',');
                    var flag = false;
                    for (var p = 0; p < kinds.length; p++) {
                        if (kindArr.indexOf(kinds[p]) > -1) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        srcArr.splice(j, 1);
                    }
                }
            }
        }
    },

    compleData: function (srcArr, desArr, nodeType, equalKind) {
        if (srcArr && srcArr.length > 0) {
            for (var j = 0; j < srcArr.length; j++) {
                var o = {};
                if (nodeType == 'LUNODE') {
                    if (srcArr[j].m.a[0].kinds.indexOf(equalKind) > -1) {
                        o.childType = 'LUNODE_1';
                    } else {
                        o.childType = 'LUNODE_2';
                    }
                }
                o.featType = nodeType;
                o.id = srcArr[j].i; // 服务已经返回为数字
                o.checked = false;
                o.isMain = 0;
                desArr.push(o);
            }
        }
    },

    // 按照种别(kindArr)的顺序进行排序,不在kindArr中的种别将被放置在最后
    sortByKind: function (srcArr, kindArr) {
        var result = [];
        for (var j = 0; j < kindArr.length; j++) {
            for (var p = srcArr.length - 1; p >= 0; p--) {
                var kinds = srcArr[p].m.a[0].kinds.split(',');
                if (kinds.indexOf(kindArr[j]) > -1) {
                    result.push(srcArr[p]);
                    srcArr.splice(p, 1);
                }
            }
        }
        return result.concat(srcArr);
    },

    highLightselectedFeatures: function (data) {
        this.editResult.relationFeatures = data.data;
        this.createOperation('选中所选点和面', this.editResult);
    },

    doRelate: function (data) {
        this.editResult.relationFeatures = data.data;
        this.onFinish(this.editResult);
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                var newEditResult = FM.Util.clone(this.options.editResult);
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    }
});
