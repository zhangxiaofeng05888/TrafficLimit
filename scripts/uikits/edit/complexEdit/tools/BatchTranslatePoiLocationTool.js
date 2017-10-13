/**
 * Created by wuzhen on 2016/3/30
 */

fastmap.uikit.complexEdit.BatchTranslatePoiLocationTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'BatchTranslatePoiLocationTool';

        this.selectFeedback = null;
        this.newLocationFeedback = null;
        this.dashLineFeedback = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
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
        this.offsetX = 0;
        this.offsetY = 0;

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
        this.offsetX = 0;
        this.offsetY = 0;
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.offsetX = 0;
        this.offsetY = 0;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.offsetX = 0;
        this.offsetY = 0;
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

        if (this.editResult.operationType !== 'translate') {
            return;
        }

        if (this.editResult.pois.length === 0) {
            return;
        }

        var offsetX = this.editResult.offsetX + this.offsetX;
        var offsetY = this.editResult.offsetY + this.offsetY;
        if (offsetX === 0 && offsetY === 0) {
            return;
        }

        var newLocations = this.translatePois(this.editResult.pois, offsetX, offsetY);

        var symbol = this.symbolFactory.getSymbol('complexEdit_dash_line_center_arrow');
        for (var i = 0; i < newLocations.length; ++i) {
            var s = this.editResult.pois[i].geometry;
            var e = newLocations[i];
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
            this.setMouseInfo('请框选需要平移的poi,按住ctrl支持反选和追加,按t键进行平移操作');
            return;
        }

        if (this.editResult.operationType === 'translate') {
            var pois = this.editResult.pois;
            if (!pois || pois.length === 0) {
                this.setMouseInfo('没有选中的poi,不能进行显示坐标平移');
                return;
            }
            this.setMouseInfo('拖拽poi平移显示坐标,按s键选择poi');
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
        if (this.editResult.operationType !== 'translate') {
            return;
        }

        var offsetX = this.editResult.offsetX + this.offsetX;
        var offsetY = this.editResult.offsetY + this.offsetY;
        if (offsetX === 0 && offsetY === 0) {
            return;
        }

        var newLocations = this.translatePois(this.editResult.pois, offsetX, offsetY);

        var symbol = this.symbolFactory.getSymbol('complexEdit_poi_new');

        for (var i = 0; i < newLocations.length; ++i) {
            var loc = newLocations[i];
            this.newLocationFeedback.add(loc, symbol);
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

        if (this.editResult.operationType === 'select') {
            this.resetSelectFeedback();
            this.resetFeedback();
        } else {
            var offset = this.getOffset();
            this.offsetX = offset.x;
            this.offsetY = offset.y;
            this.resetDashLineFeedback();
            this.resetNewLocationFeedback();
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
            this.updateNewLoactions();
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

    updateNewLoactions: function () {
        var offset = this.getOffset();
        var newEditResult = this.editResult.clone();
        newEditResult.offsetX += offset.x;
        newEditResult.offsetY += offset.y;
        this.createOperation('平移显示坐标', newEditResult);
    },

    getOffset: function () {
        var offsetX = this.endPoint.coordinates[0] - this.startPoint.coordinates[0];
        var offsetY = this.endPoint.coordinates[1] - this.startPoint.coordinates[1];

        return {
            x: offsetX,
            y: offsetY
        };
    },

    translatePois: function (pois, offsetX, offsetY) {
        var newLocations = [];
        for (var i = 0; i < pois.length; ++i) {
            var poi = pois[i];
            newLocations.push({
                type: 'Point',
                coordinates: [
                    poi.geometry.coordinates[0] + offsetX,
                    poi.geometry.coordinates[1] + offsetY
                ]
            });
        }

        return newLocations;
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
                newEditResult.offsetX = 0;
                newEditResult.offsetY = 0;
                this.createOperation('重新选择poi', newEditResult);
                stopBubbling = true;
                break;
            case 't':
                newEditResult = this.editResult.clone();
                newEditResult.operationType = 'translate';
                this.createOperation('平移poi显示坐标', newEditResult);
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
