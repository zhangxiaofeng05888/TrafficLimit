/**
 * Created by zhaohang on 2017/5/16.
 */

fastmap.uikit.topoEdit.TipBusLaneTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.StartFinishPointResult();
        editResult.geoLiveType = 'TIPBUSLANE';
        editResult.snapActors = [{
            geoLiveType: 'TIPLINKS',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'RDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.StartFinishPointResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'TIPBUSLANE';
        var startLinkId = 0;
        var startLinkType = '';
        var finishLinkId = 0;
        var finishLinkType = '';
        var viasLinkTypeFlag = false;
        var tipLinksSelect = false;
        var vias = [];
        for (var i = 0; i < obj.deep.f_array.length; i++) {
            if (obj.deep.f_array[i].flag.indexOf('1') > -1) {
                startLinkId = obj.deep.f_array[i].id;
                startLinkType = obj.deep.f_array[i].type === 2 ? 'TIPLINKS' : 'RDLINK';
            }
            if (obj.deep.f_array[i].flag.indexOf('2') > -1) {
                finishLinkId = obj.deep.f_array[i].id;
                finishLinkType = obj.deep.f_array[i].type === 2 ? 'TIPLINKS' : 'RDLINK';
            }
            if (obj.deep.f_array[i].flag.indexOf('0') > -1) {
                vias.push(this.featureSelector.selectByFeatureId(obj.deep.f_array[i].id, (obj.deep.f_array[i].type === 2 ? 'TIPLINKS' : 'RDLINK')));
                if (obj.deep.f_array[i].type === 2) {
                    viasLinkTypeFlag = true;
                }
            }
        }
        editResult.startData = {
            linkData: this.featureSelector.selectByFeatureId(startLinkId, startLinkType),
            pointData: obj.deep.gSLoc
        };
        editResult.endData = {
            linkData: this.featureSelector.selectByFeatureId(finishLinkId, finishLinkType),
            pointData: obj.deep.gELoc
        };
        editResult.vias = vias;
        if (startLinkType === 'TIPLINKS' || finishLinkType === 'TIPLINKS' || viasLinkTypeFlag) {
            tipLinksSelect = true;
        }
        if (!tipLinksSelect && (startLinkId === finishLinkId || this.uikitUtil.canHookByLink(this.featureSelector.selectByFeatureId(startLinkId, startLinkType), this.featureSelector.selectByFeatureId(finishLinkId, finishLinkType)))) {
            editResult.needVisaFlag = false;
            if (vias.length === 0) {
                editResult.linkGeo = obj.geometry.g_location;
            }
        }
        editResult.tipLinksSelect = tipLinksSelect;
        editResult.snapActors = [{
            geoLiveType: 'TIPLINKS',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'RDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var bussLaneData = fastmap.dataApi.tipBusLane({});
        bussLaneData.deep.gSLoc = this.geometryAlgorithm.precisionGeometry(editResult.startData.pointData, 5);
        bussLaneData.deep.gELoc = this.geometryAlgorithm.precisionGeometry(editResult.endData.pointData, 5);
        var array = [];
        if (editResult.startData.linkData.properties.id === editResult.endData.linkData.properties.id) {
            array.push({
                id: editResult.startData.linkData.properties.id.toString(),
                type: editResult.startData.linkData.type === 'tips' ? 2 : 1,
                flag: '1|2'
            });
        } else {
            array.push({
                id: editResult.startData.linkData.properties.id.toString(),
                type: editResult.startData.linkData.type === 'tips' ? 2 : 1,
                flag: '1'
            });
            array.push({
                id: editResult.endData.linkData.properties.id.toString(),
                type: editResult.endData.linkData.type === 'tips' ? 2 : 1,
                flag: '2'
            });
        }
        for (var i = 0; i < editResult.vias.length; i++) {
            array.push({
                id: editResult.vias[i].properties.id.toString(),
                type: editResult.vias[i].type === 'tips' ? 2 : 1,
                flag: '0'
            });
        }
        bussLaneData.deep.f_array = array;
        bussLaneData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(this.getFinalLinksGeo(editResult), 5);
        bussLaneData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.startData.pointData, 5);
        return this.dataServiceTips.saveTips(bussLaneData, 0);
    },

    /**
     * 更新接口
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var bussLaneData = editResult.originObject;
        bussLaneData.deep.gSLoc = this.geometryAlgorithm.precisionGeometry(editResult.startData.pointData, 5);
        bussLaneData.deep.gELoc = this.geometryAlgorithm.precisionGeometry(editResult.endData.pointData, 5);
        var array = [];
        if (editResult.startData.linkData.properties.id === editResult.endData.linkData.properties.id) {
            array.push({
                id: editResult.startData.linkData.properties.id.toString(),
                type: editResult.startData.linkData.type === 'tips' ? 2 : 1,
                flag: '1|2'
            });
        } else {
            array.push({
                id: editResult.startData.linkData.properties.id.toString(),
                type: editResult.startData.linkData.type === 'tips' ? 2 : 1,
                flag: '1'
            });
            array.push({
                id: editResult.endData.linkData.properties.id.toString(),
                type: editResult.endData.linkData.type === 'tips' ? 2 : 1,
                flag: '2'
            });
        }
        for (var i = 0; i < editResult.vias.length; i++) {
            array.push({
                id: editResult.vias[i].properties.id.toString(),
                type: editResult.vias[i].type === 'tips' ? 2 : 1,
                flag: '0'
            });
        }
        bussLaneData.deep.f_array = array;
        bussLaneData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(this.getFinalLinksGeo(editResult), 5);
        bussLaneData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.startData.pointData, 5);
        return this.dataServiceTips.saveTips(bussLaneData, 1);
    },

    getFinalLinksGeo: function (editResult) {
        var locationGeo = {
            type: 'MultiLineString',
            coordinates: []
        };
        var vias = editResult.vias;
        var startLink = editResult.startData.linkData; // 起点link
        var endLink = editResult.endData.linkData; // 终点link
        var startPoint = editResult.startData.pointData; // 起点
        var finishPoint = editResult.endData.pointData; // 终点
        if (editResult.tipLinksSelect) {
            if ((startLink.properties.id === endLink.properties.id) && startLink.type === 'tips' && vias.length === 0) {
                var coordinatesArray = [];
                var sPoint = this.geometryAlgorithm.nearestLocations(startPoint, startLink.geometry.geometries[1]);
                var ePoint = this.geometryAlgorithm.nearestLocations(finishPoint, endLink.geometry.geometries[1]);
                if (sPoint.previousIndex > ePoint.previousIndex) {
                    coordinatesArray.push(startPoint.coordinates);
                    for (var p = sPoint.previousIndex; p > ePoint.previousIndex; p--) {
                        coordinatesArray.push(startLink.geometry.geometries[1].coordinates[p]);
                    }
                    coordinatesArray.push(finishPoint.coordinates);
                } else {
                    coordinatesArray.push(startPoint.coordinates);
                    for (var k = sPoint.nextIndex; k < ePoint.nextIndex; k++) {
                        coordinatesArray.push(startLink.geometry.geometries[1].coordinates[k]);
                    }
                    coordinatesArray.push(finishPoint.coordinates);
                }
                locationGeo.coordinates.push(coordinatesArray);
                return locationGeo;
            }
            if (startLink.type === 'tips') {
                locationGeo.coordinates.push(startLink.geometry.geometries[1].coordinates);
            } else {
                locationGeo.coordinates.push(startLink.geometry.coordinates);
            }
            for (var l = 0; l < vias.length; l++) {
                if (vias[l].type === 'tips') {
                    locationGeo.coordinates.push(vias[l].geometry.geometries[1].coordinates);
                } else {
                    locationGeo.coordinates.push(vias[l].geometry.coordinates);
                }
            }
            if (startLink.properties.id !== endLink.properties.id) {
                if (endLink.type === 'tips') {
                    locationGeo.coordinates.push(endLink.geometry.geometries[1].coordinates);
                } else {
                    locationGeo.coordinates.push(endLink.geometry.coordinates);
                }
            }
            return locationGeo;
        }
        var startLocationGeo = []; // 起点到挂接的经过线几何
        var finishLocationGeo = []; // 挂接的经过线到终点的几何
        var startPointLocation = this.geometryAlgorithm.nearestLocations(startPoint, startLink.geometry);
        var finishPointLocation = this.geometryAlgorithm.nearestLocations(finishPoint, endLink.geometry);
        if (!editResult.needVisaFlag && vias.length === 0) {
            locationGeo = editResult.linkGeo;
        } else {
            var startVisaLink = vias[0]; // 起点挂接的经过link
            var finishVisaLink = vias[vias.length - 1]; // 终点挂接的经过link
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
            locationGeo.coordinates.push(startLocationGeo);
            for (var q = 0; q < vias.length; q++) {
                locationGeo.coordinates.push(vias[q].geometry.coordinates);
            }
            locationGeo.coordinates.push(finishLocationGeo);
        }
        return locationGeo;
    }
});
