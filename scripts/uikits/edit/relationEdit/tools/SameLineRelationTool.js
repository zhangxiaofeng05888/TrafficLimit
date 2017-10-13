/**
 * Created by linglong on 2016/12/8.
 * 同一线
 */
fastmap.uikit.relationEdit.SameLineRelationTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.name = 'SameLineRelationTool';

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
        this.selectTypes = ['RDLINK', 'ADLINK', 'ZONELINK', 'LULINK'];

        this.eventController.on(L.Mixin.EventTypes.CTRLPANELSELECTED, this.highLightselectedFeatures);
        this.eventController.on(L.Mixin.EventTypes.ADDRELATION, this.doRelate);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.shutdown.apply(this, arguments);

        this.eventController.off(L.Mixin.EventTypes.CTRLPANELSELECTED, this.highLightselectedFeatures);
        this.eventController.off(L.Mixin.EventTypes.ADDRELATION, this.doRelate);
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'RdSameLinkPanel' });

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
        fastmap.uikit.relationEdit.RectSelectTool.prototype.resetSelectFeedback.apply(this, arguments);
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
            for (var i = 0; i < length; i++) {
                var temp = this.editResult.relationFeatures[i];
                var feature = this.featureSelector.selectByFeatureId(temp.id, temp.featType);
                var linkSymbol;
                if (temp.checked) {
                    switch (temp.featType) {
                        case 'RDLINK':
                            linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_same'); break;
                        case 'ADLINK':
                            linkSymbol = this.symbolFactory.getSymbol('ls_adLink_same'); break;
                        case 'ZONELINK':
                            linkSymbol = this.symbolFactory.getSymbol('ls_zoneLink_same'); break;
                        default:
                            linkSymbol = this.symbolFactory.getSymbol('ls_luLink_same'); break;
                    }
                    this.defaultFeedback.add(feature.geometry, linkSymbol);
                }
            }
        }
        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        if (this.isQueried && !this.editResult.relationFeatures.length) {
            this.setMouseInfo('没有符合条件的数据');
            return;
        }
        if (!this.editResult.relationFeatures.length) {
            this.setMouseInfo('请框选制作同一线数据');
            return;
        }
        this.setMouseInfo('');
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        this.startPoint = this.mousePoint;
        this.isDragging = true;

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return true;
        }

        this.endPoint = this.mousePoint;

        this.resetSelectFeedback();

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        this.isDragging = false;

        var box = this.getSelectBox(this.startPoint, this.endPoint);
        var param = {
            types: ['RDLINK', 'ADLINK', 'ZONELINK', 'LULINK'],
            wkt: box
        };
        var _self = this;
        this.dataService.queryBySpatial(param).then(function (res) {
            for (var i in res) {
                if (res[i].length) {
                    _self.isQueried = true;
                }
            }
            var arr = [];
            var equalKind = '21';
            var luIncludeKind = ['1', '2', '3', '4', '5', '6', '7', '22', '23', '40'];
            _self.compleLinkdata(res.RDLINK, arr, 'RDLINK');
            _self.compleLinkdata(res.ADLINK, arr, 'ADLINK');
            res.ZONELINK = _self.filterZoneLink(res.ZONELINK); // 根据kind过滤zoneLink
            _self.compleLinkdata(res.ZONELINK, arr, 'ZONELINK');
            res.LULINK = _self.filterLuLink(res.LULINK, equalKind, luIncludeKind); // 根据kind过滤LuLink
            _self.compleLinkdata(res.LULINK, arr, 'LULINK', equalKind, luIncludeKind);

            if (arr.length) {
                _self.editResult.relationFeatures = arr;
                _self.createOperation('选中具有同一点关系的线', _self.editResult);
                _self.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'RdSameLinkPanel', data: arr });
            } else {
                _self.editResult.relationFeatures = arr;
                _self.createOperation('选中具有同一点关系的线', _self.editResult);
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

    // 过滤 lulink的kind值能是BUA边界线，和 包含种别为大学，购物中心，医院，体育场，公墓，停车场，工业区，邮区边界线，FM面边界线的数据；
    filterLuLink: function (srcArr, equalKind, includeKind) {
        var returnArr = [];
        for (var i = 0; i < srcArr.length; i++) {
            var temp = srcArr[i];
            var kind = temp.m.c;
            if (kind == equalKind) {
                returnArr.push(temp);
                continue;
            }
            var kindArr = kind.split(';');
            for (var j = 0; j < kindArr.length; j++) {
                if (includeKind.indexOf(kindArr[j]) > -1) {
                    returnArr.push(temp);
                    break;
                }
            }
        }
        return returnArr;
    },
    // 只有kind 为KDzonelink、AOIlink的才可以做同一线
    filterZoneLink: function (srcArr) {
        var returnArr = [];
        for (var i = 0; i < srcArr.length; i++) {
            var temp = srcArr[i];
            if (temp.m.c == '1' || temp.m.c == '2') {
                returnArr.push(temp);
            }
        }
        return returnArr;
    },
    // 对接返回的数据格式进行转化， equalKind和luIncludeKind只是对于LuLink有用
    compleLinkdata: function (srcArr, desArr, nodeType, equalKind, luIncludeKind) {
        if (srcArr && srcArr.length > 0) {
            for (var j = 0; j < srcArr.length; j++) {
                var o = {};
                o.featType = nodeType;
                o.kind = srcArr[j].m.c; // 种别
                if (nodeType == 'LULINK') { // luLink需要根据分类分成两种
                    if (o.kind == equalKind) {
                        o.childFeatType = 'LULINK_1';
                    } else {
                        var kindArr = o.kind.split(';');
                        for (var m = 0; m < kindArr.length; m++) {
                            if (luIncludeKind.indexOf(kindArr[m]) > -1) {
                                o.childFeatType = 'LULINK_2';
                                break;
                            }
                        }
                    }
                } else {
                    o.childFeatType = o.featType;
                }
                o.id = srcArr[j].i; // 服务已经返回为数字 pid
                o.checked = false;
                o.sNodePid = parseInt(srcArr[j].m.a, 10); // 起点的pid
                o.eNodePid = parseInt(srcArr[j].m.b, 10); // 终点的pid
                o.sameLinkPid = srcArr[j].m.d; // 同一线的pid 用于判断是否已经做过同一线，如果有值表示做过同一线了
                o.sameNodeStartPid = srcArr[j].m.e; // 起点同一点的pid ，如果有值表示已经做了同一点
                o.sameNodeEndPid = srcArr[j].m.f; // 终点同一点的pid ，如果有值表示已经做了同一点
                if (o.sameNodeStartPid && o.sameNodeEndPid && !o.sameLinkPid) { // 表示已经做过同一点，没有做过同一线的才可以创建同一线
                    desArr.push(o);
                }
            }
        }
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
