/**
 * Created by xujie on 2016/3/30
 */

fastmap.uikit.complexEdit.BatchPoiGuideManualTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'BatchPoiGuideManualTool';

        this.selectFeedback = null;
        this.stepFeedback1 = null;
        this.stepFeedback2 = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.editResult = this.options.editResult.clone();
        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.stepFeedback1 = new fastmap.mapApi.Feedback();
        this.stepFeedback2 = new fastmap.mapApi.Feedback();
        this.selectFeedback.priority = 0;
        this.stepFeedback1.priority = 1;
        this.stepFeedback2.priority = 2;
        this.installFeedback(this.selectFeedback);
        this.installFeedback(this.stepFeedback1);
        this.installFeedback(this.stepFeedback2);
        var snapActor = this.createFullScreenFeatureSnapActor('RDLINK');
        this.installSnapActor(snapActor);
        snapActor = this.createFullScreenFeatureSnapActor('TIPLINKS');
        this.installSnapActor(snapActor);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);

        this.selectFeedback = null;
        this.stepFeedback1 = null;
        this.stepFeedback2 = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetStepFeedback1();
        this.resetStepFeedback2();
        this.resetMouseInfo();
    },

    resetSelectFeedback: function () {
        if (!this.selectFeedback) {
            return;
        }

        this.selectFeedback.clear();

        if (this.editResult.operationType !== 'selectPoi') {
            return;
        }

        if (this.isDragging && this.startPoint && this.endPoint) {
            var box = this.getSelectBox(this.startPoint, this.endPoint);
            var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.selectFeedback.add(box, symbol);
        }

        this.refreshFeedback();
    },

    resetStepFeedback1: function () {
        if (!this.stepFeedback1) {
            return;
        }

        this.stepFeedback1.clear();

        this.drawPois();

        this.refreshFeedback();
    },

    resetStepFeedback2: function () {
        if (!this.stepFeedback2) {
            return;
        }

        this.stepFeedback2.clear();

        this.drawPoint();

        this.drawGuideDashLine();

        this.drawGuideLink();

        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (this.editResult.operationType === 'selectPoi') {
            this.setMouseInfo('请框选需要调整显示坐标的poi,按住ctrl支持反选和追加,按m键选择参考位置');
            return;
        }

        if (this.editResult.operationType === 'selectPoint') {
            var pois = this.editResult.pois;
            if (!pois || pois.length === 0) {
                this.setMouseInfo('没有选中的poi,不能进行引导坐标调整');
                return;
            }
            this.setMouseInfo('请点击poi引导坐标参考点,按s键选择poi');
            return;
        }
    },

    drawPois: function () {
        var pois = this.editResult.pois;
        if (!pois || pois.length === 0) {
            return;
        }

        var poiSymbol = this.symbolFactory.getSymbol('complexEdit_poi_old');
        var lineSymbol = this.symbolFactory.getSymbol('complexEdit_dash_line_green');

        for (var i = 0; i < pois.length; ++i) {
            var poi = pois[i];
            var poiGuide = {
                type: 'Point',
                coordinates: [
                    poi.properties.guideX,
                    poi.properties.guideY
                ]
            };
            var line = {
                type: 'LineString',
                coordinates: [
                    poi.geometry.coordinates,
                    poiGuide.coordinates
                ]
            };
            this.stepFeedback1.add(line, lineSymbol);
            this.stepFeedback1.add(poi.geometry, poiSymbol);
        }
    },

    drawPoint: function () {
        if (this.editResult.operationType !== 'selectPoint') {
            return;
        }

        if (!this.editResult.point) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('complexEdit_poi_new');

        this.stepFeedback2.add(this.editResult.point, symbol);
    },

    drawGuideDashLine: function () {
        if (this.editResult.operationType !== 'selectPoint') {
            return;
        }

        if (!this.editResult.guidePoint) {
            return;
        }

        var guidePoint = this.editResult.guidePoint;
        var pois = this.editResult.pois;
        var symbol = this.symbolFactory.getSymbol('complexEdit_dash_line_red');
        for (var i = 0; i < pois.length; ++i) {
            var s = pois[i].geometry;
            var e = guidePoint;
            var line = {
                type: 'LineString',
                coordinates: [
                    s.coordinates,
                    e.coordinates
                ]
            };
            this.stepFeedback2.add(line, symbol);
        }
    },

    drawGuideLink: function () {
        if (this.editResult.operationType !== 'selectPoint') {
            return;
        }

        if (!this.editResult.guideLink) {
            return;
        }

        var guideLink = this.editResult.guideLink;

        var symbol = this.symbolFactory.getSymbol('complexEdit_poi_guide_link');

        var linkGeometry = null;
        if (guideLink.properties.geoLiveType === 'RDLINK') {
            linkGeometry = guideLink.geometry;
        } else {
            linkGeometry = guideLink.geometry.geometries[1];
        }
        this.stepFeedback2.add(linkGeometry, symbol);
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        this.startPoint = this.mousePoint;
        this.isDragging = true;

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.endPoint = this.mousePoint;

        if (this.editResult.operationType === 'selectPoi') {
            this.resetSelectFeedback();
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;

        if (this.editResult.operationType === 'selectPoi') {
            var box = this.getSelectBox(this.startPoint, this.endPoint);

            var selectedFeatures = this.featureSelector.selectByGeometry(box, ['IXPOI']);

            if (event.originalEvent.ctrlKey) {
                this.modifyFeatures(selectedFeatures);
            } else {
                this.replaceFeatures(selectedFeatures);
            }
        } else {
            this.updateNewLoactions(this.mousePoint);
        }

        return true;
    },

    modifyFeatures: function (selectedFeatures) {
        var newEditResult = this.editResult.clone();
        var addItems = FM.Util.differenceBy(selectedFeatures, newEditResult.pois, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.pois, selectedFeatures, 'properties.id');
        newEditResult.pois = remainItems.concat(addItems);
        this.createOperation('修改选中poi', newEditResult);
    },

    replaceFeatures: function (selectedFeatures) {
        var newEditResult = this.editResult.clone();
        newEditResult.pois = selectedFeatures;
        this.createOperation('替换选中poi', newEditResult);
    },

    updateNewLoactions: function (point) {
        var newEditResult = this.editResult.clone();
        newEditResult.point = point;
        this.snapController.setDrawSnapCross(false);
        var snapResult = this.snapController.snap(point);
        this.snapController.setDrawSnapCross(true);
        if (snapResult) {
            newEditResult.guidePoint = snapResult.point;
            newEditResult.guideLink = snapResult.feature;
        }
        this.createOperation('指定poi引导坐标参考点', newEditResult);
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

    onKeyUp: function (event) {
        var newEditResult = null;
        var key = event.key;
        var stopBubbling = false;
        switch (key) {
            case 's':
                newEditResult = this.editResult.clone();
                newEditResult.operationType = 'selectPoi';
                newEditResult.point = null;
                this.createOperation('重新选择poi', newEditResult);
                stopBubbling = true;
                break;
            case 'm':
                newEditResult = this.editResult.clone();
                newEditResult.operationType = 'selectPoint';
                this.createOperation('指定poi引导坐标参考点', newEditResult);
                stopBubbling = true;
                break;
            default:
                break;
        }

        if (stopBubbling) {
            return;
        }

        fastmap.uikit.complexEdit.ComplexTool.prototype.onKeyUp.call(this, event);
    }
});
