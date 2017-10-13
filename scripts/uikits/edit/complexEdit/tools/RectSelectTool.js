/**
 * Created by xujie3949 on 2016/12/8.
 * 实现框选逻辑，其他需要框选功能的工具可以从此类派生
 * 为了区分与relationEdit里面的RectSelectTool.js所以新建此类
 */

fastmap.uikit.complexEdit.RectSelectTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'ComplexRectSelectTool';

        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
        this.selectTypes = null;
        this.selectedFeatures = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = [];
        this.selectedFeatures = [];

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);

        this.selectFeedback = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDragging = false;
        this.selectTypes = null;
        this.selectedFeatures = null;
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
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

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult && this.editResult.children) {
            var geometry = {
                type: 'MultiPoint',
                coordinates: []
            };
            var length = this.editResult.children.length;
            for (var i = 0; i < length; ++i) {
                var feature = this.editResult.children[i];
                var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
                this.defaultFeedback.add(feature.geometry, nodeSymbol);
                geometry.coordinates.push(feature.geometry.coordinates);
            }

            if (length > 0) {
                this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
                var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
                var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
                var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
                this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
                var geographyGeometry = this.geojsonTransform.convertGeometry(buffer);
                // 绘制包络线
                var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
                this.defaultFeedback.add(geographyGeometry, bufferSymbol);
            }
        }

        this.refreshFeedback();
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

        this.selectedFeatures = this.featureSelector.selectByGeometry(box, this.selectTypes);
        this.afterSelected();
        return true;
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

    afterSelected: function () {
        swal('afterSelected方法需要重写');
    },

    createGivenObjectSnapActor: function (objects) {
        if (!objects) {
            throw new Error('GivenFeatureSnapActor必须指定捕捉的要素');
        }

        var snapActor = new fastmap.mapApi.snap.GivenObjectSnapActor();
        snapActor.setObjects(objects);

        return snapActor;
    }
});
