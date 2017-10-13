/**
 * Created by wuzhen on 2016/3/30
 */

fastmap.uikit.complexEdit.BatchConvergePoiLocationTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'BatchConvergePoiLocationTool';

        this.selectFeedback = null;
        this.newLocationFeedback = null;
        this.dashLineFeedback = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.editResult = this.options.editResult.clone();
        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.newLocationFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.selectFeedback.priority = 0;
        this.dashLineFeedback.priority = 1;
        this.defaultFeedback.priority = 2;
        this.newLocationFeedback.priority = 3;
        this.installFeedback(this.selectFeedback);
        this.installFeedback(this.newLocationFeedback);
        this.installFeedback(this.dashLineFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);

        this.selectFeedback = null;
        this.dashLineFeedback = null;
        this.newLocationFeedback = null;
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
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetNewLocationFeedback();
        this.resetMouseInfo();
    },

    resetSelectFeedback: function () {
        if (!this.selectFeedback) {
            return;
        }

        this.selectFeedback.clear();

        if (this.editResult.operationType !== 'select') {
            return;
        }

        if (this.isDragging && this.startPoint && this.endPoint) {
            var box = this.getSelectBox(this.startPoint, this.endPoint);
            var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.selectFeedback.add(box, symbol);
        }

        this.refreshFeedback();
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();

        if (this.editResult.operationType !== 'converge') {
            return;
        }

        var pois = this.editResult.pois;
        if (pois.length === 0) {
            return;
        }

        if (!this.editResult.point) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('complexEdit_dash_line_center_arrow');
        for (var i = 0; i < pois.length; ++i) {
            var s = pois[i].geometry;
            var e = this.editResult.point;
            var line = {
                type: 'LineString',
                coordinates: [
                    s.coordinates,
                    e.coordinates
                ]
            };
            this.dashLineFeedback.add(line, symbol);
        }

        this.refreshFeedback();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFeaturesOldPosition();

        this.refreshFeedback();
    },

    resetNewLocationFeedback: function () {
        if (!this.newLocationFeedback) {
            return;
        }

        this.newLocationFeedback.clear();

        this.drawFeaturesNewPosition();

        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (this.editResult.operationType === 'select') {
            this.setMouseInfo('请框选需要重合的poi,按住ctrl支持反选和追加,按c键选择重合位置');
            return;
        }

        if (this.editResult.operationType === 'converge') {
            var pois = this.editResult.pois;
            if (!pois || pois.length === 0) {
                this.setMouseInfo('没有选中的poi,不能进行显示坐标重合');
                return;
            }
            this.setMouseInfo('请点击poi显示坐标重合点,按s键选择poi');
            return;
        }
    },

    drawFeaturesOldPosition: function () {
        var pois = this.editResult.pois;
        if (!pois || pois.length === 0) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('complexEdit_poi_old');

        for (var i = 0; i < pois.length; ++i) {
            var poi = pois[i];
            this.defaultFeedback.add(poi.geometry, symbol);
        }
    },

    drawFeaturesNewPosition: function () {
        if (this.editResult.operationType !== 'converge') {
            return;
        }

        if (!this.editResult.point) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('complexEdit_poi_new');

        this.defaultFeedback.add(this.editResult.point, symbol);
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

        if (this.editResult.operationType === 'select') {
            this.resetSelectFeedback();
            this.resetFeedback();
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

        if (this.editResult.operationType === 'select') {
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
        this.createOperation('重合poi显示坐标', newEditResult);
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
                newEditResult.operationType = 'select';
                newEditResult.point = null;
                this.createOperation('重新选择poi', newEditResult);
                stopBubbling = true;
                break;
            case 'c':
                newEditResult = this.editResult.clone();
                newEditResult.operationType = 'converge';
                this.createOperation('重合poi显示坐标', newEditResult);
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
