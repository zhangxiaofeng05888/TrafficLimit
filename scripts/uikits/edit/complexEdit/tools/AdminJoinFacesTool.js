/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.complexEdit.AdminJoinFacesTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();

        this.name = 'AdminJoinFacesTool';
        this.startPoint = null;
        this.endPoint = null;
        this.isDrag = false;
        this.pointAndFacedata = { adFacePid: [], zoneFacePid: [], adAdminPid: [] };
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);

        this.eventController.on(L.Mixin.EventTypes.CTRLPANELSELECTED, this.selectedFeatures);
        this.eventController.on(L.Mixin.EventTypes.JOINFACE, this.doRelate);
        this.eventController.on(L.Mixin.EventTypes.DISMISSFACE, this.disRelate);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.eventController.off(L.Mixin.EventTypes.CTRLPANELSELECTED, this.selectedFeatures);
        this.eventController.off(L.Mixin.EventTypes.JOINFACE, this.doRelate);
        this.eventController.off(L.Mixin.EventTypes.DISMISSFACE, this.disRelate);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);

        this.selectFeedback = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDrag = false;
        this.pointAndFacedata = { adFacePid: [], zoneFacePid: [], adAdminPid: [] };
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'AdminJoinFacesPanel' });
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
        if (this.isDrag && this.startPoint && this.endPoint) {
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
        if (this.editResult.adAdminObj) {
            var adadminHight = this.symbolFactory.getSymbol('pt_relation_border');
            this.defaultFeedback.add(this.editResult.adAdminObj.geometry, adadminHight);
        }
        if (this.editResult.faceObj) {
            var faceHight = this.symbolFactory.getSymbol('py_face');
            this.defaultFeedback.add(this.editResult.faceObj.geometry, faceHight);
        }
        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        if (!this.startPoint) {
            this.setMouseInfo('请框选要做关联的数据');
            return;
        }
        this.setMouseInfo('');
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        this.startPoint = this.latlngToPoint(event.latlng);
        this.isDrag = true;

        this.resetMouseInfo();
        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDrag) {
            return true;
        }
        this.endPoint = this.latlngToPoint(event.latlng);

        this.resetSelectFeedback();

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        this.isDrag = false;

        this.endPoint = this.latlngToPoint(event.latlng);

        var box = this.getSelectBox(this.startPoint, this.endPoint);

        var features = this.featureSelector.selectByGeometry(box, ['ADADMIN', 'ZONEFACE', 'ADFACE']);

        this.selectBox(features);
        return true;
    },

    selectBox: function (features) {
        this.pointAndFacedata = { adFacePid: [], zoneFacePid: [], adAdminPid: [] };
        var flag = false;
        for (var i = 0; i < features.length; i++) {
            switch (features[i].properties.geoLiveType) {
                case 'ADADMIN':
                    if (!this.computeCount(this.pointAndFacedata.adAdminPid, features[i].properties.id)) {
                        this.pointAndFacedata.adAdminPid.push(features[i]);
                        flag = true;
                    }
                    break;
                case 'ADFACE':
                    if (!this.computeCount(this.pointAndFacedata.adFacePid, features[i].properties.id)) {
                        this.pointAndFacedata.adFacePid.push(features[i]);
                        flag = true;
                    }
                    break;
                default:
                    if (!this.computeCount(this.pointAndFacedata.zoneFacePid, features[i].properties.id)) {
                        this.pointAndFacedata.zoneFacePid.push(features[i]);
                        flag = true;
                    }
            }
        }
        var options = {
            panelName: 'AdminJoinFacesPanel',
            data: this.pointAndFacedata
        };
        if (flag) {
            this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options);
        }
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

    computeCount: function (data, compareData) {
        var count = 0;
        for (var j = 0; j < data.length; j++) {
            if (data[j].pid === compareData) {
                count++;
            }
        }
        return count;
    },

    selectedFeatures: function (param) {
        if (param.objType == 'ADADMIN') {
            this.editResult.adAdminObj = param.feature;
        } else {
            this.editResult.faceObj = param.feature;
        }
        this.resetEditResultFeedback();
    },

    doRelate: function () {
        this.onFinish(this.editResult);
    },

    disRelate: function () {
        // 将regionId参数设为0;
        this.editResult.adAdminObj = { properties: { id: 0 } };
        this.onFinish(this.editResult);
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }
        var key = event.key;
        switch (key) {
            case ' ': break;
            default: break;
        }
        // 覆盖默认的热键;
        return true;
    }
});
