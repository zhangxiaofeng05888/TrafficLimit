/**
 * Created by linglong on 2017/4/21.
 */

fastmap.uikit.complexEdit.ChangeLinkDirectTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'ChangeLinkDirectTool';
        this.snapActor = null;

        this.descLine = null;
        this.ascLine = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
        this.descLine = null;
        this.ascLine = null;
    },

    refresh: function () {
        this.splitLink();
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
        this.fireChangeLinkToAngular();
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
        if (!this.editResult.point) {
            this.setMouseInfo('点击Link进行修改方向!');
        } else {
            if (this.editResult.originObject.direct === 1) {
                this.setMouseInfo('点击两侧虚拟点修改道路方向');
            } else {
                this.setMouseInfo('按空格保存，或重新选择');
            }
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        this.installLinkSnapActor();
        if (this.editResult.point) {
            this.installNodeSnapActor(this.editResult.point.coordinates);
        }
    },

    installLinkSnapActor: function () {
        if (this.editResult.point) return;
        this.uninstallSnapActor(this.snapActor);
        var features = {
            id: this.editResult.originObject.pid,
            geoLiveType: this.editResult.originObject.geoLiveType
        };
        this.snapActor = this.createGivenFeatureSnapActor([features]);
        this.installSnapActor(this.snapActor);
    },

    // 开启捕捉可选方向端点
    installNodeSnapActor: function (poinGeo) {
        this.uninstallSnapActor(this.snapActor);
        this.snapActor = this.setIntallGivenPointSnapActor(poinGeo);
        this.installSnapActor(this.snapActor);
    },

    setIntallGivenPointSnapActor: function (poinGeo) {
        var middlePoint = {
            type: 'Point',
            coordinates: poinGeo
        };
        var sLen = this.descLine.coordinates.length;
        var eLen = this.ascLine.coordinates.length;
        var sPoint = {
            type: 'Point',
            coordinates: this.descLine.coordinates[sLen - 1]
        };
        var ePoint = {
            type: 'Point',
            coordinates: this.ascLine.coordinates[eLen - 1]
        };
        // 直接组成pairs格式
        var pairs = [];
        pairs.push({ key: middlePoint, value: 1 });
        pairs.push({ key: ePoint, value: 2 });
        pairs.push({ key: sPoint, value: 3 });
        return this.createGivenPointSnapActor(pairs);
    },

    splitLinkByLocation: function (point, link, flag) {
        if (!point) { throw new Error('请传入一个分割点'); }
        var index = -1;
        var obj = {
            preLine: null,
            nextLine: null
        };
        var res = this.geometryAlgorithm.nearestLocations(point, link);
        for (var i = 0; i < link.coordinates.length; i++) {
            var condtion = link.coordinates[i][0] === res.nextPoint.coordinates[0] &&
                link.coordinates[i][1] === res.nextPoint.coordinates[1];
            if (condtion) {
                index = i;
            }
        }
        var tempCoordinates = link.coordinates.slice(0, index).concat([point.coordinates]).reverse();
        if (flag === 'next') {
            tempCoordinates = [point.coordinates].concat(link.coordinates.slice(index));
        }
        return this.uikitUtil.createPath(tempCoordinates);
    },
    // 计算顺逆方向坐标
    splitLink: function () {
        var _self = this;
        if (!this.editResult.point) return;
        this.descLine = this.splitLinkByLocation(this.editResult.point, this.editResult.originObject.geometry, 'pre');
        this.ascLine = this.splitLinkByLocation(this.editResult.point, this.editResult.originObject.geometry, 'next');
        var symbolPixelLength = 100;
        this.descLine.coordinates.forEach(function (item, index) {
            _self.descLine.coordinates[index] = _self.transform.lonlat2Pixel(item[0], item[1], this.map.getZoom());
        });
        this.ascLine.coordinates.forEach(function (item, index) {
            _self.ascLine.coordinates[index] = _self.transform.lonlat2Pixel(item[0], item[1], this.map.getZoom());
        });
        var startPoint = this.geometryFactory.fromGeojson(this.descLine).getPointByLength(symbolPixelLength);
        var endPoint = this.geometryFactory.fromGeojson(this.ascLine).getPointByLength(symbolPixelLength);

        if (startPoint[3]) {
            var temp1 = this.uikitUtil.createPoint([startPoint[3].x, startPoint[3].y]);
            this.descLine = this.splitLinkByLocation(temp1, this.descLine, 'pre');
            this.descLine.coordinates = this.descLine.coordinates.reverse();
        }
        if (endPoint[3]) {
            var temp2 = this.uikitUtil.createPoint([endPoint[3].x, endPoint[3].y]);
            this.ascLine = this.splitLinkByLocation(temp2, this.ascLine, 'pre');
            this.ascLine.coordinates = this.ascLine.coordinates.reverse();
        }
        this.descLine.coordinates.forEach(function (item, index) {
            _self.descLine.coordinates[index] = _self.transform.PixelToLonlat(item[0], item[1], this.map.getZoom());
        });
        this.ascLine.coordinates.forEach(function (item, index) {
            _self.ascLine.coordinates[index] = _self.transform.PixelToLonlat(item[0], item[1], this.map.getZoom());
        });
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        this.setCurrentSelectedLinkSymboal();
        if (this.editResult.point) {
            this.setClickPointSymboal();
            this.setLinkDirectSymboal();
        }
        this.refreshFeedback();
    },

    setCurrentSelectedLinkSymboal: function () {
        var inLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
        this.defaultFeedback.add(this.editResult.originObject.geometry, inLinkSymbol);
    },

    setClickPointSymboal: function () {
        var pointSymbol = this.symbolFactory.getSymbol('pt_line_point');
        this.defaultFeedback.add(this.editResult.point, pointSymbol);
    },

    setLinkDirectSymboal: function () {
        var triangleMarkerSymbolDes = FM.Util.clone(this.symbolFactory.getSymbol('relationEdit_ls_line_point_direct'));
        triangleMarkerSymbolDes.symbols[0].marker.color = 'blue';
        triangleMarkerSymbolDes.symbols[0].marker.outLine.color = 'blue';
        triangleMarkerSymbolDes.symbols[1].color = 'blue';
        var triangleMarkerSymbolAsc = FM.Util.clone(this.symbolFactory.getSymbol('relationEdit_ls_line_point_direct'));
        triangleMarkerSymbolAsc.symbols[0].marker.color = 'red';
        triangleMarkerSymbolAsc.symbols[1].color = 'red';
        switch (this.editResult.originObject.direct) {
            case 1:
                this.defaultFeedback.add(this.descLine, triangleMarkerSymbolDes);
                this.defaultFeedback.add(this.ascLine, triangleMarkerSymbolAsc);
                break;
            case 2:
                this.defaultFeedback.add(this.ascLine, triangleMarkerSymbolAsc);
                break;
            default:
                this.defaultFeedback.add(this.descLine, triangleMarkerSymbolDes);
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    setSingleLinkDirect: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);

        newEditResult.originObject.direct = res.value;

        var directDesc = newEditResult.originObject.direct === 3 ? '逆方向' : '顺方向';
        this.createOperation('设置link方向为' + directDesc, newEditResult);
    },

    setDoubleLinkDirect: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        if (!this.editResult.point) {
            newEditResult.point = res.point;
        }
        newEditResult.originObject.direct = 1;
        this.createOperation('设置link方向为双方向', newEditResult);
    },

    fireChangeLinkToAngular: function () {
        if (this.editResult.point) {
            this.eventController.fire(L.Mixin.EventTypes.LINKDIRECTCHANGED, { data: this.editResult.originObject });
        }
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (res.value === 1 || res.value === undefined) {
            this.setDoubleLinkDirect(res);
        } else {
            this.setSingleLinkDirect(res);
        }

        return true;
    },

    onWheel: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onWheel.apply(this, arguments)) {
            return false;
        }
        this.refresh();

        return true;
    },

    onKeyUp: function (event) {
        var key = event.key;
        switch (key) {
            case 'Escape':
                var newEditResult = FM.Util.clone(this.options.editResult);
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                if (this.onFinish) {
                    var objectEditCtrl = FM.uikit.ObjectEditController();
                    var changes = objectEditCtrl.data.getChanges();
                    if (changes) {
                        this.onFinish(this.editResult);
                    } else {
                        swal('link方向没有发生变化', 'warning');
                    }
                }
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
