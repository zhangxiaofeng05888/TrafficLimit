/**
 * Created by zhaohang on 2017/4/19.
 */
/** 制作范围线类型tips使用*/

fastmap.uikit.relationEdit.ScopeLineTool = fastmap.uikit.relationEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'ScopeLineTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['RDLINK', 'TIPLINKS'];
        this.selectedFeatures = [];
        this.editResult.polygon = this.getBuffer(this.editResult.links);

        this.refresh();
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        if (!this.editResult.links) {
            this.setMouseInfo('请在地图上框选link');
        } else {
            this.setMouseInfo('按ctrl键继续框选，或者按空格保存');
        }
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult && this.editResult.links) {
            var length = this.editResult.links.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var feature = this.editResult.links[i];
                    var linkSymbol = this.symbolFactory.getSymbol('ls_link');
                    if (feature.type === 'tips') {
                        this.defaultFeedback.add(feature.geometry.geometries[1], linkSymbol);
                    } else {
                        this.defaultFeedback.add(feature.geometry, linkSymbol);
                    }
                }

                if (this.editResult.polygon) {
                    // 绘制包络线
                    var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
                    this.defaultFeedback.add(this.editResult.polygon, bufferSymbol);
                }
            }
        }

        this.refreshFeedback();
    },

    getBuffer: function (links) {
        var geometry = {
            type: 'GeometryCollection',
            geometries: []
        };

        for (var i = 0, len = links.length; i < len; i++) {
            geometry.geometries.push(links[i].geometry);
        }

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
        var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
        var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
        var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
        var geographyGeometry = this.geojsonTransform.convertGeometry(buffer);

        return geographyGeometry;
    },

    /**
     * 获取线的所有点的坐标
     * @param links
     * @returns {Array}
     */
    getPointOnLinks: function (links) {
        var coordinates = [];
        for (var i = 0, len = links.length; i < len; i++) {
            coordinates = coordinates.concat(links[i].geometry.coordinates);
        }
        return coordinates;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.relationEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyLinks();
        } else {
            this.replaceLinks();
        }

        return true;
    },

    modifyLinks: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var addItems = FM.Util.differenceBy(this.selectedFeatures, newEditResult.links, 'properties.id');
        var remainItems = FM.Util.differenceBy(newEditResult.links, this.selectedFeatures, 'properties.id');
        newEditResult.links = remainItems.concat(addItems);
        newEditResult.polygon = this.getBuffer(newEditResult.links);
        this.createOperation('框选增加link', newEditResult);
    },

    replaceLinks: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.links = this.selectedFeatures;
        newEditResult.polygon = this.getBuffer(newEditResult.links);
        this.createOperation('框选link', newEditResult);
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    }
});
