/**
 * Created by linglong on 2017/3/22.
 */

fastmap.uikit.complexEdit.SideRoadTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
        this.name = 'SideRoadResult';
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
        this.textObj = {
            type: 'Point',
            coordinates: []
        };
        this.StartNodeObj = {
            type: 'Point',
            coordinates: []
        };
        this.EndNodeObj = {
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
        this.isStatisfied();
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    isStatisfied: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        // 计算看现在师傅满足制作上下线分离的条件;
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
        // 如果link存在了则不能扑捉进入线和不能扑捉的线(也就是能和自己挂接的线;);
        if (this.editResult.links.length) {
            this.installCandidateSnapActor();
            return;
        }
        return;
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

        this.installSnapActor(this.snapActor);
    },

    installCandidateSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        this.snapActor = this._getSnapLinks();
        this.installSnapActor(this.snapActor);
    },

    resetMouseInfo: function () {
        if (!this.editResult.links.length) {
            this.setMouseInfo('开始制作辅路，请选择进入线!');
            return;
        }
        if (this.editResult.links.length == 1 && !this.editResult.distance) {
            this.setMouseInfo('选择挂接的link进行追踪或按c键制作辅路!');
            return;
        }
        if (this.editResult.links.length > 1 && !this.editResult.distance) {
            this.setMouseInfo('对所选的link进行修改或按c键制作辅路!');
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
        if (this.editResult.links.length) {
            var inLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            for (var i = 0; i < this.editResult.links.length; i++) {
                this.defaultFeedback.add(this.editResult.links[i].geometry, inLinkSymbol);
            }
        }
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

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }
        var newEditResult = FM.Util.clone(this.editResult);
        if (!this.editResult.links[0]) {
            newEditResult.links[0] = res.feature;
            newEditResult.sNodePid = res.feature.properties.snode;
            this.createOperation('选择进入线', newEditResult);
        } else {
            var num = this._indexOfEditResultLinks(res.feature);
            if (num == -1) {
                this._PlusLink(res.feature);
            } else {
                this._minusLink(num);
            }
        }
        return true;
    },

    onWheel: function (event) {
        var e = window.event || event;
        if (!this.map) { return false; }
        if (!this.editResult.distance) {
            fastmap.uikit.complexEdit.ComplexTool.prototype.onWheel.apply(this, arguments);
        }
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.distance += delta * 1.1;
        if (newEditResult.distance <= 4) {
            newEditResult.distance = 4;
        } else if (newEditResult.distance >= 80) {
            newEditResult.distance = 80;
        }
        this.createOperation('滚动滑轮制作辅路', newEditResult);
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
                if (!this.editResult.distance && this.editResult.links.length) {
                    newEditResult.distance = 4;
                    newEditResult.sideType = 1;
                    this.createOperation('滚动滑轮制作辅路', newEditResult);
                }
                break;
            case 'r':
                if (this.editResult.distance) {
                    newEditResult.sideType = 2;
                    this.createOperation('制作右侧辅路', newEditResult);
                }
                break;
            case 'l':
                if (this.editResult.distance) {
                    newEditResult.sideType = 3;
                    this.createOperation('制作左侧辅路', newEditResult);
                }
                break;
            case 'd':
                if (this.editResult.distance) {
                    newEditResult.sideType = 1;
                    this.createOperation('制作两侧辅路', newEditResult);
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

        if (this.editResult.sideType == 2) {
            this.dotLineStartObj.coordinates.pop();
            this.dotLineEndObj.coordinates.pop();
        }
        if (this.editResult.sideType == 3) {
            this.dotLineStartObj.coordinates.shift();
            this.dotLineEndObj.coordinates.shift();
        }

        this.StartNodeObj.coordinates = [this.middleLineObj.coordinates[0][0], this.middleLineObj.coordinates[0][1]];
        this.EndNodeObj.coordinates = [
            this.middleLineObj.coordinates[this.middleLineObj.coordinates.length - 1][0],
            this.middleLineObj.coordinates[this.middleLineObj.coordinates.length - 1][1]
        ];
        // 计算文字显示坐标;
        var tempLineString = this.geometryFactory.fromGeojson(this.middleLineObj);
        var tempValue = tempLineString.getPointByLength(tempLineString.length() / 2);
        this.textObj.coordinates = [tempValue[3].x, tempValue[3].y];
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
        var startNodeSymbol = this.symbolFactory.getSymbol('pt_node_s');
        var enodeNodeSymbol = this.symbolFactory.getSymbol('pt_node_e');
        if (this.editResult.sideType != 3) {
            this.defaultFeedback.add(this.rightLineObj, symbolRight);
        }
        if (this.editResult.sideType != 2) {
            this.defaultFeedback.add(this.leftLineObj, symbolLeft);
        }
        this.defaultFeedback.add(this.middleLineObj, symbolMiddle);
        this.defaultFeedback.add(this.dotLineStartObj, symbolDotted1);
        this.defaultFeedback.add(this.dotLineEndObj, symbolDotted2);
        this.defaultFeedback.add(this.textObj, symbolText);
        this.defaultFeedback.add(this.StartNodeObj, startNodeSymbol);
        this.defaultFeedback.add(this.EndNodeObj, enodeNodeSymbol);
    },

    // 自动追踪;
    _autoTrail: function (feature, dirNode) {
        var _self = this;
        var requestParma = {
            command: 'CREATE',
            type: 'RDLINK',
            data: {
                linkPid: feature.properties.id,
                nodePidDir: dirNode,
                maxNum: 30
            }
        };
        return this.dataService
            .getByCondition(requestParma)
            .then(function (res) {
                var result = [];
                res.forEach(function (data) {
                    result.push(data.pid);
                });
                return [_self.editResult.links[0].properties.id].concat(result);
            })
            .catch(function (err) {
                _self.setCenterInfo('追踪接续线失败，请手动选择', 1000);
                return [];
            });
    },

    _getConnectNode: function (selectLine, flag) {
        var firstLineInfo = this.editResult.links[0].properties;
        var secondLineInfo = selectLine.properties;
        var temp = secondLineInfo.snode;
        if (secondLineInfo.snode == firstLineInfo.snode || secondLineInfo.snode == firstLineInfo.enode) {
            temp = (flag == 'dirNode') ? secondLineInfo.snode : secondLineInfo.enode;
        } else {
            temp = (flag == 'dirNode') ? secondLineInfo.enode : secondLineInfo.snode;
        }
        return parseInt(temp, 10);
    },

    _indexOfEditResultLinks: function (selectLine) {
        for (var i = 0; i < this.editResult.links.length; i++) {
            if (this.editResult.links[i].properties.id == selectLine.properties.id) {
                return i;
            }
        }
        return -1;
    },

    // 增加接续线;
    _PlusLink: function (feature) {
        var newEditResult = FM.Util.clone(this.editResult);
        if (this.editResult.links.length === 1) {
            var _self = this;
            var trailNode = this._getConnectNode(feature, 'trailNode');
            var p = this._autoTrail(feature, trailNode).then(function (links) {
                if (links.length > 0) {
                    return _self.uikitUtil.getCanvasFeaturesFromServer(links, 'RDLINK').then(function (features) {
                        newEditResult.links = new Array(features.length);
                        var index;
                        for (var i = 0; i < features.length; i++) {
                            index = links.indexOf(features[i].properties.id);
                            newEditResult.links[index] = features[i];
                        }
                    }).catch(function (err) {
                        _self.setCenterInfo('查询接续线信息失败，请手动选择', 1000);
                        newEditResult.links = [];
                    });
                }

                newEditResult.links = [];
                return null;
            });
            Promise.all([p]).then(function () {
                _self.continue();
                _self.dirNode = _self._getConnectNode(feature, 'dirNode');
                newEditResult.sNodePid = (_self.dirNode == _self.editResult.links[0].properties.snode) ? _self.editResult.links[0].properties.enode : _self.editResult.links[0].properties.snode;
                newEditResult.distance = undefined;
                _self.createOperation('自动追踪接续线', newEditResult);
            });
        } else {
            newEditResult.links.push(feature);
            newEditResult.distance = undefined;
            this.createOperation('增加接续线', newEditResult);
        }
    },

    // 反选接续线;
    _minusLink: function (minusIndex) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.distance = undefined;
        newEditResult.links = newEditResult.links.splice(0, minusIndex);
        this.createOperation('反选修改接续link', newEditResult);
    },

    _getSnapLinks: function () {
        var _self = this;
        var snapNodePids = null;
        var length = this.editResult.links.length;
        if (this.editResult.links.length === 1) {
            snapNodePids = [this.editResult.links[0].properties.snode, this.editResult.links[0].properties.enode];
        } else {
            var lastLink = this.editResult.links[length - 1];
            var preLink = this.editResult.links[length - 2];
            if (lastLink.properties.snode === preLink.properties.snode || lastLink.properties.snode === preLink.properties.enode) {
                snapNodePids = [lastLink.properties.enode];
            } else if (lastLink.properties.enode === preLink.properties.snode || lastLink.properties.enode === preLink.properties.enode) {
                snapNodePids = [lastLink.properties.snode];
            }
        }

        var linkPids = [];
        for (var i = 0; i < this.editResult.links.length; i++) {
            linkPids.push(this.editResult.links[i].properties.id);
        }

        var isRouted = this.uikitUtil.isRouted;
        var func = function (feature) {
            if (feature.properties.id === _self.editResult.links[0].properties.id) {
                return false;
            }
            for (var k = 0; k < linkPids.length; k++) {
                if (feature.properties.id === linkPids[k]) {
                    return true;
                }
            }

            for (var j = 0; j < snapNodePids.length; j++) {
                if (isRouted(snapNodePids[j], feature)) {
                    return true;
                }
            }

            return false;
        };

        return this.createFeatureSnapActor('RDLINK', null, func);
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
