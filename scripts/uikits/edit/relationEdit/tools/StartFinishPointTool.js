/**
 * Created by zhaohang on 2017/4/26.
 */

fastmap.uikit.relationEdit.StartFinishPointTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'StartFinishPointTool';
        this.snapActor = null;
        this.changeVisa = false;
        this.changeStartPoint = false;
        this.changeFinishPoint = false;
        this.currentViaLink = null;
        this.currentViaLinkNode = [];
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

        this.snapActor = null;
        this.changeVisa = false;
        this.changeStartPoint = false;
        this.changeFinishPoint = false;
        this.currentViaLink = null;
        this.currentViaLinkNode = [];
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

    resetSnapActor: function () {
        this.uninstallSnapActors();

        if (!this.editResult.startData || !this.editResult.endData || this.changeStartPoint || this.changeFinishPoint) {
            this.installInLinkSnapActor();
            return;
        }
        if (this.changeVisa) {
            this.installViasLinkSnapActor();
            return;
        }
    },

    getTopoLinks: function (link, node) {
        var self = this;
        var topoLinks = this.featureSelector.selectByFunction(function (feature) {
            if (feature.properties.id === link.properties.id) {
                return false;
            }

            // 不可通行的link过滤掉
            if (!self.uikitUtil.canHookByLink(link, feature)) {
                return false;
            }

            var sNodePid = parseInt(feature.properties.snode, 10);
            var eNodePid = parseInt(feature.properties.enode, 10);

            for (var i = 0; i < node.length; i++) {
                if (sNodePid === node[i].properties.id || eNodePid === node[i].properties.id) {
                    return true;
                }
            }
            return false;
        }, 'RDLINK');

        return topoLinks;
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActors();
        var actorInfos = this.editResult.snapActors;
        for (var i = 0; i < actorInfos.length; ++i) {
            var actorInfo = actorInfos[i];
            if (!actorInfo.enable) {
                continue;
            }
            var snapActor = this.createFeatureSnapActor(actorInfo.geoLiveType, actorInfo.exceptions);
            snapActor.priority = actorInfo.priority;
            this.installSnapActor(snapActor);
        }
    },

    installViasLinkSnapActor: function () {
        this.uninstallSnapActors();
        var viaLinks = this.editResult.vias;
        var self = this;
        var inLinkPid = this.editResult.startData.linkData.properties.id;
        var outLinkPid = this.editResult.endData.linkData.properties.id;

        // 注意：这个函数里一定不能出现this的引用
        // 如果要用this下的变量和函数，都要先赋给本地变量，然后在func中使用本地变量
        var func = function (feature) {
            if (feature.properties.id === inLinkPid || feature.properties.id === outLinkPid) {
                return false;
            }
            for (var i = 0; i < viaLinks.length; i++) {
                if (feature.properties.id === viaLinks[i].properties.id) {
                    return false;
                }
            }
            if (feature.type === 'tips' || self.editResult.tipLinksSelect) {
                return true;
            }
            var topoLinks = self.getTopoLinks(self.currentViaLink, self.currentViaLinkNode);
            topoLinks = FM.Util.differenceBy(topoLinks, viaLinks, 'properties.id');
            for (var j = 0; j < topoLinks.length; j++) {
                if (feature.properties.id == topoLinks[j].properties.id) {
                    return true;
                }
            }

            return false;
        };

        var actorInfos = this.editResult.snapActors;
        for (var i = 0; i < actorInfos.length; ++i) {
            var actorInfo = actorInfos[i];
            if (!actorInfo.enable) {
                continue;
            }
            var snapActor = this.createFeatureSnapActor(actorInfo.geoLiveType, null, func);
            snapActor.priority = actorInfo.priority;
            this.installSnapActor(snapActor);
        }
    },

    resetMouseInfo: function () {
        if (!this.editResult.startData || this.changeStartPoint) {
            this.setMouseInfo('请选择起点!');
            return;
        }
        if (!this.editResult.endData || this.changeFinishPoint) {
            this.setMouseInfo('请选择终点!');
            return;
        }
        if (!this.changeVisa) {
            this.setMouseInfo('按c编辑经过线或者按空格保存!');
            return;
        }
        if (this.changeVisa) {
            this.setMouseInfo('正在编辑经过线,按空格保存!');
            return;
        }
        this.setMouseInfo('');
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        if (this.editResult.startData) {
            var inLinkGeometry = {
                type: 'LineString',
                coordinates: []
            };
            if (this.editResult.startData.linkData.type === 'tips') {
                inLinkGeometry.coordinates = this.editResult.startData.linkData.geometry.geometries[1].coordinates;
            } else {
                inLinkGeometry.coordinates = this.editResult.startData.linkData.geometry.coordinates;
            }
            var startLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(inLinkGeometry, startLinkSymbol);
            var startPointSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(this.editResult.startData.pointData, startPointSymbol);
        }

        if (this.editResult.endData) {
            var endLinkGeometry = {
                type: 'LineString',
                coordinates: []
            };
            if (this.editResult.endData.linkData.type === 'tips') {
                endLinkGeometry.coordinates = this.editResult.endData.linkData.geometry.geometries[1].coordinates;
            } else {
                endLinkGeometry.coordinates = this.editResult.endData.linkData.geometry.coordinates;
            }
            var finishLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(endLinkGeometry, finishLinkSymbol);
            var finishPointSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(this.editResult.endData.pointData, finishPointSymbol);
        }
        if (this.editResult.vias.length) {
            var viasLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_via');
            var viasLinkGeometry = {
                type: 'LineString',
                coordinates: []
            };
            for (var i = 0; i < this.editResult.vias.length; i++) {
                if (this.editResult.vias[i].type === 'tips') {
                    viasLinkGeometry.coordinates = this.editResult.vias[i].geometry.geometries[1].coordinates;
                } else {
                    viasLinkGeometry.coordinates = this.editResult.vias[i].geometry.coordinates;
                }
                this.defaultFeedback.add(viasLinkGeometry, viasLinkSymbol);
            }
        }

        this.refreshFeedback();
    },

    selectStartPoint: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var link = res.feature;
        var point = res.point;
        newEditResult.startData = {
            linkData: link,
            pointData: point
        };
        if (link.type === 'tips') {
            newEditResult.tipLinksSelect = true;
        }
        this.createOperation('起点信息', newEditResult);
    },

    selectFinishPoint: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var link = res.feature;
        var point = res.point;
        newEditResult.endData = {
            linkData: link,
            pointData: point
        };
        if (link.type === 'tips') {
            newEditResult.tipLinksSelect = true;
        }
        this.createOperation('终点信息', newEditResult);
    },

    getTipLinksGeo: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var startLink = newEditResult.startPointData.linkData; // 起点link
        var finishLink = newEditResult.finishPointData.linkData; // 终点link
        if (startLink.properties.id === finishLink.properties.id) {
            newEditResult.startFinishLocation = startLink.geometry.geometries[1].coordinates;
        } else {
            if (startLink.type === 'tips') {
                newEditResult.startLocation = startLink.geometry.geometries[1].coordinates;
            } else {
                newEditResult.startLocation = startLink.geometry.coordinates;
            }
            if (finishLink.type === 'tips') {
                newEditResult.finishLocation = finishLink.geometry.geometries[1].coordinates;
            } else {
                newEditResult.finishLocation = finishLink.geometry.coordinates;
            }
        }
        this.createOperation('获取起终点到经过线link几何', newEditResult);
    },

    // 修改经过线
    switchToSelectViaLink: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var startLink = newEditResult.startData.linkData;
        var endLink = newEditResult.endData.linkData;
        var tipLinksSelect = true;
        if (startLink.type !== 'tips' && endLink.type !== 'tips') {
            this.currentViaLink = startLink;
            if (this.featureSelector.selectByFeatureId(startLink.properties.snode, 'RDNODE')) {
                this.currentViaLinkNode.push(this.featureSelector.selectByFeatureId(startLink.properties.snode, 'RDNODE'));
            }
            if (this.featureSelector.selectByFeatureId(startLink.properties.enode, 'RDNODE')) {
                this.currentViaLinkNode.push(this.featureSelector.selectByFeatureId(startLink.properties.enode, 'RDNODE'));
            }
            tipLinksSelect = false;
        }
        newEditResult.vias = [];
        newEditResult.tipLinksSelect = tipLinksSelect;
        this.createOperation('清空经过线', newEditResult);
    },

    getLinkOtherNode: function (link, node) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);

        for (var i = 0; i < node.length; i++) {
            if (sNodePid === node[i].properties.id) {
                return [this.featureSelector.selectByFeatureId(eNodePid, 'RDNODE')];
            } else if (eNodePid === node[i].properties.id) {
                return [this.featureSelector.selectByFeatureId(sNodePid, 'RDNODE')];
            }
        }
        return [];
    },

    changeVisaLinks: function (res) {
        this.currentViaLink = res.feature;
        var newEditResult = FM.Util.clone(this.editResult);
        if (res.feature.type === 'tips') {
            newEditResult.tipLinksSelect = true;
        } else {
            this.currentViaLinkNode = this.getLinkOtherNode(this.currentViaLink, this.currentViaLinkNode);
        }
        newEditResult.vias.push(this.currentViaLink);
        this.createOperation('添加经过线', newEditResult);
    },

    getViaLink: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var self = this;
        if (newEditResult.startData.linkData.type === 'tips' || newEditResult.endData.linkData.type === 'tips') {
            newEditResult.vias = [];
            self.createOperation('选择经过线', newEditResult);
        } else {
            if (newEditResult.needVisaFlag) {
                var param = {
                    type: 'RDLANEVIA',
                    data: {
                        inLinkPid: newEditResult.startData.linkData.properties.id,
                        outLinkPid: newEditResult.endData.linkData.properties.id
                    }
                };
                this.pause();
                this.dataService
                    .getByCondition(param)
                    .then(function (result) {
                        if (result.length > 0) {
                            var viaLinkIds = result;
                            return self.uikitUtil.getCanvasFeaturesFromServer(viaLinkIds, 'RDLINK');
                        }
                        return [];
                    })
                    .then(function (res) {
                        self.continue();
                        newEditResult.vias = res;
                        self.createOperation('选择经过线', newEditResult);
                    })
                    .catch(function (err) {
                        self.continue();
                        self.setCenterInfo('计算经过线失败,请手动选择经过线', 1000);
                    });
            } else {
                self.setCenterInfo('请手动选择经过线，或按空格保存', 1000);
            }
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        var newEditResult = FM.Util.clone(this.editResult);
        switch (key) {
            case 'c':   // 修改经过线
                newEditResult.vias = [];
                this.switchToSelectViaLink();
                this.changeVisa = true;
                this.changeStartPoint = false;
                this.changeFinishPoint = false;
                this.createOperation('修改经过线', newEditResult);
                break;
            case 's':   // 修改起点
                this.changeStartPoint = true;
                this.changeVisa = false;
                this.changeFinishPoint = false;
                this.createOperation('修改起点位置', newEditResult);
                break;
            case 'e':   // 修改终点
                this.changeFinishPoint = true;
                this.changeVisa = false;
                this.changeStartPoint = false;
                this.createOperation('修改终点位置', newEditResult);
                break;
            case 'q':   // 交换起终点
                this.changeFinishPoint = false;
                this.changeVisa = false;
                this.changeStartPoint = false;
                var startPointData = newEditResult.startData;
                var finishPointData = newEditResult.endData;
                newEditResult.startData = finishPointData;
                newEditResult.endData = startPointData;
                this.createOperation('交换起终点', newEditResult);
                this.getViaLink();
                break;
            default:
                break;
        }

        return true;
    },

    checkNeedVisaLink: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        if (newEditResult.tipLinksSelect) {
            return;
        }
        var needVisaFlag = true;
        var linkGeo = {
            type: 'MultiLineString',
            coordinates: []
        };
        var startFinishLocationGeo = [];
        var startLink = newEditResult.startData.linkData;// 起点所在link
        var startPoint = newEditResult.startData.pointData;// 起点
        var endLink = newEditResult.endData.linkData; //  终点所在link
        var endPoint = newEditResult.endData.pointData; // 终点
        var startPointLocation = this.geometryAlgorithm.nearestLocations(startPoint, startLink.geometry);
        var finishPointLocation = this.geometryAlgorithm.nearestLocations(endPoint, endLink.geometry);
        var startLocationGeo = []; // 起点到挂接的经过线几何
        var finishLocationGeo = []; // 挂接的经过线到终点的几何
        if (startLink.properties.id === endLink.properties.id) { // 起终点在同一条link
            if (startPointLocation.previousIndex === finishPointLocation.previousIndex) {
                startFinishLocationGeo.push(startPoint.coordinates);
                startFinishLocationGeo.push(endPoint.coordinates);
            } else if (startPointLocation.previousIndex < finishPointLocation.previousIndex) {
                startFinishLocationGeo.push(startPoint.coordinates);
                for (var p = startPointLocation.nextIndex; p < finishPointLocation.nextIndex; p++) {
                    startFinishLocationGeo.push(startLink.geometry.coordinates[p]);
                }
                startFinishLocationGeo.push(endPoint.coordinates);
            } else if (startPointLocation.previousIndex > finishPointLocation.previousIndex) {
                startFinishLocationGeo.push(startPoint.coordinates);
                for (var q = startPointLocation.previousIndex; q > finishPointLocation.nextIndex; q--) {
                    startFinishLocationGeo.push(startLink.geometry.coordinates[q]);
                }
                startFinishLocationGeo.push(endPoint.coordinates);
            }
            needVisaFlag = false;
            linkGeo.coordinates.push(startFinishLocationGeo);
        } else if (this.uikitUtil.canHookByLink(startLink, endLink)) {
            var startVisaLink = endLink; // 起点挂接的经过link
            var finishVisaLink = startLink; // 终点挂接的经过link
            if (startLink.properties.snode === startVisaLink.properties.snode || startLink.properties.snode === startVisaLink.properties.enode) {
                startLocationGeo.push(startPointLocation.point.coordinates);
                startLocationGeo.push(startPointLocation.previousPoint.coordinates);
                for (var i = startPointLocation.previousIndex - 1; i > -1; i--) {
                    startLocationGeo.push(startLink.geometry.coordinates[i]);
                }
            } else if (startLink.properties.enode === startVisaLink.properties.snode || startLink.properties.enode === startVisaLink.properties.enode) {
                startLocationGeo.push(startPointLocation.point.coordinates);
                startLocationGeo.push(startPointLocation.nextPoint.coordinates);
                for (var j = startPointLocation.nextIndex + 1; j < startLink.geometry.coordinates.length; j++) {
                    startLocationGeo.push(startLink.geometry.coordinates[j]);
                }
            }
            if (endLink.properties.snode === finishVisaLink.properties.snode || endLink.properties.snode === finishVisaLink.properties.enode) {
                for (var m = 0; m < finishPointLocation.previousIndex; m++) {
                    finishLocationGeo.push(endLink.geometry.coordinates[m]);
                }
                finishLocationGeo.push(finishPointLocation.previousPoint.coordinates);
                finishLocationGeo.push(finishPointLocation.point.coordinates);
            } else if (endLink.properties.enode === finishVisaLink.properties.snode || endLink.properties.enode === finishVisaLink.properties.enode) {
                for (var n = endLink.geometry.coordinates.length - 1; n > finishPointLocation.nextIndex; n--) {
                    finishLocationGeo.push(endLink.geometry.coordinates[n]);
                }
                finishLocationGeo.push(finishPointLocation.nextPoint.coordinates);
                finishLocationGeo.push(finishPointLocation.point.coordinates);
            }
            linkGeo.coordinates.push(startLocationGeo);
            linkGeo.coordinates.push(finishLocationGeo);
            needVisaFlag = false;
        }
        newEditResult.needVisaFlag = needVisaFlag;
        newEditResult.linkGeo = linkGeo;
        this.createOperation('添加经过线', newEditResult);
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (!this.editResult.startData || this.changeStartPoint) {
            this.selectStartPoint(res);
            if (this.changeStartPoint) {
                this.checkNeedVisaLink();
                this.getViaLink();
            }
        } else if (!this.editResult.endData || this.changeFinishPoint) {
            this.selectFinishPoint(res);
            this.checkNeedVisaLink();
            this.getViaLink();
        } else if (this.changeVisa) {
            this.changeVisaLinks(res);
        }
        return true;
    }
});
