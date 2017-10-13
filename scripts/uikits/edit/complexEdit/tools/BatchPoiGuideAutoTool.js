/**
 * Created by xujie on 2016/3/30
 */

fastmap.uikit.complexEdit.BatchPoiGuideAutoTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'BatchPoiGuideAutoTool';

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
        this.stepFeedback1.priority = 2;
        this.stepFeedback2.priority = 1;
        this.installFeedback(this.selectFeedback);
        this.installFeedback(this.stepFeedback1);
        this.installFeedback(this.stepFeedback2);

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

        this.drawLinks();

        this.drawGuideDashLine();

        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (this.editResult.operationType === 'selectPoi') {
            this.setMouseInfo('请框选需要调整引导坐标和引导link的poi,按住ctrl支持反选和追加,按a键选择link或测线');
            return;
        }

        if (this.editResult.operationType === 'selectLink') {
            var pois = this.editResult.pois;
            if (!pois || pois.length === 0) {
                this.setMouseInfo('没有选中的poi,不能自动计算引导坐标和引导link');
                return;
            }
            this.setMouseInfo('请框选需要的link,按住ctrl支持反选和追加,按s键选择poi');
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

    drawGuideDashLine: function () {
        if (this.editResult.operationType !== 'selectLink') {
            return;
        }

        var pois = this.editResult.pois;
        if (!pois || pois.length === 0) {
            return;
        }

        var points = this.editResult.guidePoints;
        if (!points || points.length === 0) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('complexEdit_dash_line_red');
        for (var i = 0; i < pois.length; ++i) {
            var s = pois[i].geometry;
            var e = points[i];
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

    drawLinks: function () {
        if (this.editResult.operationType !== 'selectLink') {
            return;
        }

        var links = this.editResult.links;
        if (!links || links.length === 0) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('complexEdit_poi_guide_link');
        for (var i = 0; i < links.length; ++i) {
            var link = links[i];
            var linkGeometry = null;
            if (link.properties.geoLiveType === 'RDLINK') {
                linkGeometry = link.geometry;
            } else {
                linkGeometry = link.geometry.geometries[1];
            }
            this.stepFeedback2.add(linkGeometry, symbol);
        }
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

        this.resetSelectFeedback();

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

        var box = this.getSelectBox(this.startPoint, this.endPoint);

        var selectedFeatures = null;
        if (this.editResult.operationType === 'selectPoi') {
            selectedFeatures = this.featureSelector.selectByGeometry(box, ['IXPOI']);
            if (event.originalEvent.ctrlKey) {
                this.modifyPoiFeatures(selectedFeatures);
            } else {
                this.replacePoiFeatures(selectedFeatures);
            }
        } else {
            selectedFeatures = this.featureSelector.selectByGeometry(box, ['RDLINK', 'TIPLINKS']);
            if (event.originalEvent.ctrlKey) {
                this.modifyLinkFeatures(selectedFeatures);
            } else {
                this.replaceLinkFeatures(selectedFeatures);
            }
        }

        return true;
    },

    modifyPoiFeatures: function (selectedFeatures) {
        var newEditResult = this.editResult.clone();
        var addItems = FM.Util.differenceBy(selectedFeatures, newEditResult.pois, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.pois, selectedFeatures, 'properties.id');
        newEditResult.pois = remainItems.concat(addItems);
        this.createOperation('修改选中poi', newEditResult);
    },

    replacePoiFeatures: function (selectedFeatures) {
        var newEditResult = this.editResult.clone();
        newEditResult.pois = selectedFeatures;
        this.createOperation('替换选中poi', newEditResult);
    },

    modifyLinkFeatures: function (selectedFeatures) {
        var newEditResult = this.editResult.clone();
        var addItems = FM.Util.differenceBy(selectedFeatures, newEditResult.links, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.links, selectedFeatures, 'properties.id');
        newEditResult.links = remainItems.concat(addItems);
        newEditResult.guidePoints = [];
        newEditResult.guideLinks = [];
        this.updateGuidePoint(newEditResult);
        this.createOperation('修改选中link', newEditResult);
    },

    replaceLinkFeatures: function (selectedFeatures) {
        var newEditResult = this.editResult.clone();
        newEditResult.links = selectedFeatures;
        newEditResult.guidePoints = [];
        newEditResult.guideLinks = [];
        this.updateGuidePoint(newEditResult);
        this.createOperation('替换选中link', newEditResult);
    },

    updateGuidePoint: function (editResult) {
        var snapActor = this.createGivenObjectSnapActor(editResult.links);
        this.installSnapActor(snapActor);
        this.snapController.drawSnapCross = false;

        var pois = editResult.pois;
        var links = editResult.links;
        for (var i = 0; i < pois.length; ++i) {
            var poi = pois[i];
            var guidePoint = {
                type: 'Point',
                coordinates: [
                    poi.properties.guideX,
                    poi.properties.guideY
                ]
            };
            var res = this.snapController.snap(guidePoint);
            editResult.guidePoints[i] = res.point;
            editResult.guideLinks[i] = res.feature;
        }

        this.uninstallSnapActors();
        this.snapController.drawSnapCross = true;
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
                newEditResult.links = [];
                newEditResult.guidePoints = [];
                newEditResult.guideLinks = [];
                this.createOperation('重新选择poi', newEditResult);
                stopBubbling = true;
                break;
            case 'a':
                newEditResult = this.editResult.clone();
                newEditResult.operationType = 'selectLink';
                this.createOperation('选择引导link', newEditResult);
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
