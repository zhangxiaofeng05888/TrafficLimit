/**
 * Created by zhongxiaoming on 2017/8/18.
 */
fastmap.uikit.shapeEdit.TipLinkUpDownDepartTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
        this.objectEditCtrl = new fastmap.uikit.ObjectEditController();
        this.name = 'TipLinkUpDownDepartTool';
        this.snapActor = null;
        this.leftLineObj = {
            type: 'LineString',
            coordinates: []
        };
        this.rightLineObj = {
            type: 'LineString',
            coordinates: []
        };
        this.middleLineObj = {
            type: 'LineString',
            coordinates: []
        };
        this.dotLineStartObj = {
            type: 'LineString',
            coordinates: []
        };
        this.dotLineEndObj = {
            type: 'LineString',
            coordinates: []
        };
        this.textEndObj = {
            type: 'Point',
            coordinates: []
        };
        this.textStartObj = {
            type: 'Point',
            coordinates: []
        };
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
    },

    refresh: function () {
        // this.isStatisfied();
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    isStatisfied: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        // 计算看现在是否满足制作上下线分离的条件;
        if (!this.editResult.links.length) {
            newEditResult.distance = undefined;
            return;
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

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        // 如果不存在link则扑捉所有link;
        if (!this.editResult.links.length) {
            this.installInLinkSnapActor();
            return;
        }
        return;
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('TIPLINKS', null, this.getSelectedTipLink);

        this.installSnapActor(this.snapActor);
    },

    getSelectedTipLink: function (feature) {
        if (this.objectEditCtrl.data.rowkey == feature.properties.id) {
            return feature;
        }
        return null;
    },


    installCandidateSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        this.snapActor = this._getSnapLinks();
        this.installSnapActor(this.snapActor);
    },

    resetMouseInfo: function () {
        // if (!this.editResult.links.length) {
        //     this.setMouseInfo('开始制作上下线分离，请选择进入线!');
        //     return;
        // }
        if (!this.editResult.links.length) {
            this.setMouseInfo('按c键制作上下线分离!');
            return;
        }
        if (this.editResult.links.length >= 1 && !this.editResult.distance) {
            this.setMouseInfo('按c键制作上下线分离!');
            return;
        }
        if (this.editResult.distance) {
            this.setMouseInfo('按空格进行保存!');
            return;
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        // 绘制选中的link;
        if (this.editResult.links.length && !this.editResult.distance) {
            var inLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            for (var i = 0; i < this.editResult.links.length; i++) {
                this.defaultFeedback.add(this.editResult.links[i].geometry, inLinkSymbol);
            }
        }
        // 绘制buffer
        if (this.editResult.distance) {
            this._createAndDrawBuffer();
        }
        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

        return true;
    },

    // onLeftButtonClick: function (event) {
    //     if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonClick.apply(this, arguments)) {
    //         return false;
    //     }
    //     var res = this.snapController.snap(this.mousePoint);
    //     this._getLink(res);
    //     this.editResult.pid = res.feature.properties.id;
    //     if (!res) {
    //         return true;
    //     }
    //     var newEditResult = FM.Util.clone(this.editResult);
    //     if (!this.editResult.links[0]) {
    //         newEditResult.links[0] = res.feature;
    //         this.createOperation('选择进入线', newEditResult);
    //     }
    //     return true;
    // },

    _getLink: function (res) {
        var link = null;
        res.feature.geometry.geometries.forEach(function (item, index) {
            if (item.type == 'LineString') {
                link = item;
            }
        });
        res.feature.geometry = link;
    },

    onWheel: function (event) {
        var e = window.event || event;
        if (!this.map) { return false; }
        if (!this.editResult.distance) {
            fastmap.uikit.complexEdit.ComplexTool.prototype.onWheel.apply(this, arguments);
        }
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.distance += delta * 2.2;
        if (newEditResult.distance < 3.3) {
            newEditResult.distance = 3.3;
        } else if (newEditResult.distance > 80) {
            newEditResult.distance = 80;
        }
        this.createOperation('滚动滑轮制作上下线分离', newEditResult);
        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }
        var key = event.key;
        var newEditResult = FM.Util.clone(this.editResult);
        switch (key) {
            case 'c':
                if (!this.editResult.links.length) {
                    newEditResult.distance = 3.3;
                    this.createOperation('滚动滑轮制作上下线分离', newEditResult);
                    this.editResult.pid = this.objectEditCtrl.data.pid;
                    if (!this.editResult.links[0]) {
                        newEditResult.links[0] = { type: 'tips', geometry: this.objectEditCtrl.data.geometry.g_location, properties: { geoLiveType: 'TIPLINKS', id: this.objectEditCtrl.data.pid } };
                        this.createOperation('选择进入线', newEditResult);
                    }
                }
                break;
            default:
                break;
        }

        return true;
    },

    /* 该工具的私有方法 */
    _checkUpAndDown: function () {
        var linkAttr = [];
        if (this.editResult.links.length == 1) {
            linkAttr = this.editResult.links[0].geometry.coordinates;
        } else {
            var linkArr = [];
            var nodePid = this.dirNode;
            for (var i = 0; i < this.editResult.links.length; i++) {
                if (this.editResult.links[i].properties.snode == nodePid) {
                    if (i == 0) {
                        var temp1 = this.editResult.links[i].geometry.coordinates.slice(0);
                        linkArr = linkArr.concat(temp1.reverse());
                    } else {
                        linkArr = linkArr.concat(this.editResult.links[i].geometry.coordinates);
                        nodePid = this.editResult.links[i].properties.enode;
                    }
                    continue;
                }
                if (this.editResult.links[i].properties.enode == nodePid) {
                    if (i == 0) {
                        linkArr = linkArr.concat(this.editResult.links[i].geometry.coordinates);
                    } else {
                        var temp2 = this.editResult.links[i].geometry.coordinates.slice(0);
                        linkArr = linkArr.concat(temp2.reverse());
                        nodePid = this.editResult.links[i].properties.snode;
                    }
                }
            }
            linkAttr = linkArr;
        }
        return linkAttr;
    },

    _createAndDrawBuffer: function () {
        if (!this.editResult.links.length) { return; }
        var sortedLinks = this._checkUpAndDown();
        var baseLinePixelArr = [];  // 中间的线的地理坐标;
        var distance = this.editResult.distance / this.transform.scale(this.map);
        var linkArr = Utils.distinctArr(sortedLinks);
        for (var j = 0; j < linkArr.length; j++) {
            linkArr[j] = linkArr[j].split(',');
        }
        for (var i = 0; i < linkArr.length; i++) {
            baseLinePixelArr.push(map.latLngToContainerPoint([linkArr[i][1], linkArr[i][0]]));
        }
        this.middleLineObj.coordinates = this.uikitUtil.containerToLatlng(baseLinePixelArr, 0);
        this.rightLineObj.coordinates = this.uikitUtil.containerToLatlng(baseLinePixelArr, distance);
        this.leftLineObj.coordinates = this.uikitUtil.containerToLatlng(baseLinePixelArr, -distance);
        this.dotLineStartObj.coordinates = [
            this.rightLineObj.coordinates[0], this.middleLineObj.coordinates[0],
            this.leftLineObj.coordinates[0]
        ];
        this.dotLineEndObj.coordinates = [
            this.rightLineObj.coordinates[this.rightLineObj.coordinates.length - 1],
            this.middleLineObj.coordinates[this.middleLineObj.coordinates.length - 1],
            this.leftLineObj.coordinates[this.leftLineObj.coordinates.length - 1]
        ];
        this.textEndObj.coordinates = [this.middleLineObj.coordinates[0][0], this.middleLineObj.coordinates[0][1]];
        this.textStartObj.coordinates = [
            this.middleLineObj.coordinates[this.middleLineObj.coordinates.length - 1][0],
            this.middleLineObj.coordinates[this.middleLineObj.coordinates.length - 1][1]
        ];

        var symbolRight = this.symbolFactory.createSymbol(this._createSymbolLineObj('red', 'solid'));
        var symbolLeft = this.symbolFactory.createSymbol(this._createSymbolLineObj('green', 'solid'));
        var symbolMiddle = this.symbolFactory.createSymbol(this._createSymbolLineObj('blue', 'solid'));
        var symbolDotted1 = this.symbolFactory.createSymbol(this._createSymbolLineObj('blue', 'dot'));
        var symbolDotted2 = this.symbolFactory.createSymbol(this._createSymbolLineObj('blue', 'dot'));
        var symbolText = this.symbolFactory.createSymbol({
            type: 'TextMarkerSymbol',
            text: (this.editResult.distance).toFixed(1) + 'm',
            font: '微软雅黑',
            size: 12,
            align: 'center',
            baseline: 'middle',
            direction: 'ltr',
            color: 'red'
        });
        this.defaultFeedback.add(this.rightLineObj, symbolRight);
        this.defaultFeedback.add(this.leftLineObj, symbolLeft);
        this.defaultFeedback.add(this.middleLineObj, symbolMiddle);
        this.defaultFeedback.add(this.dotLineStartObj, symbolDotted1);
        this.defaultFeedback.add(this.dotLineEndObj, symbolDotted2);
        this.defaultFeedback.add(this.textEndObj, symbolText);
        this.defaultFeedback.add(this.textStartObj, symbolText);
    },

    _createSymbolLineObj: function (color, style) {
        var temp = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 1,
            style: style
        };
        return temp;
    }
});
