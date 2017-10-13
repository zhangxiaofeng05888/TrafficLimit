/**
 * Created by wuzhen on 2016/3/30
 */

fastmap.uikit.complexEdit.SelectPoiParentTool = fastmap.uikit.complexEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.name = 'SelectPoiParentTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['IXPOI'];
        this.selectedFeatures = [];

        this.refresh();
    },

    onRedo: function (oldEditResult, newEditResult) {

    },

    onUndo: function (oldEditResult, newEditResult) {

    },

    refresh: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.refresh.apply(this, arguments);

        this.resetPoiFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('请在地图上框选');
    },

    resetPoiFeedback: function () {
        if (this.editResult.originObject) {
            var obj = this.editResult.originObject;
            var locSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(obj.geometry, locSymbol);
            var gSymbol = this.symbolFactory.getSymbol('pt_poiGuide');
            this.defaultFeedback.add(obj.guide, gSymbol);
            var glSymbol = this.symbolFactory.getSymbol('ls_guideLink');
            this.defaultFeedback.add({
                type: 'LineString',
                coordinates: [obj.guide.coordinates, obj.geometry.coordinates]
            }, glSymbol);
        }

        this.refreshFeedback();
    },

    afterSelected: function () {
        var data = this.filterData();
        // 由于工具中不能拿到$scope下的元数据,所以在属性面板进行过滤
        this.openCreatePoiPanel(data);
    },

    filterData: function () {
        var returnData = [];
        var data = this.selectedFeatures;
        for (var i = 0, len = data.length; i < len; i++) { // 排除掉自己
            if (data[i].properties.id === this.editResult.originObject.pid) {
                continue;
            }
            returnData.push(data[i]);
        }
        return returnData;
    },

    openCreatePoiPanel: function (data) {
        var options = {
            panelName: 'selpoiParentPanel',
            data: {
                selectedData: data,
                currentData: this.editResult.originObject
            }
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options); // 打开右面浮动面板
        this.eventController.fire(L.Mixin.EventTypes.PARTSREFRESH, options); // 右面面板赋默认值
        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED);
        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
    },

    onPartsSelectedChanged: function (obj) {
        this.editResult.operFlag = obj.operFlag;
        this.editResult.parentPid = obj.parentPid;

        if (this.onFinish) {
            this.onFinish(this.editResult);
        }
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                var newEditResult = FM.Util.clone(this.options.editResult);
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    }

    // shutdown: function () {
    //     fastmap.uikit.complexEdit.RectSelectTool.prototype.shutdown.apply(this, arguments);
    //
    //     this.resetStatus();
    // },
    //
    // resetStatus: function () {
    //     fastmap.uikit.complexEdit.RectSelectTool.prototype.resetStatus.apply(this, arguments);
    //
    //     this.selectFeedback = null;
    //     this.startPoint = null;
    //     this.endPoint = null;
    //     this.isDragging = false;
    //     this.selectTypes = null;
    //     this.selectedFeatures = null;
    // },
    //
    // refresh: function () {
    //     this.resetSelectFeedback();
    //     this.resetEditResultFeedback();
    // },
    //
    // resetSelectFeedback: function () {
    //     if (!this.selectFeedback) {
    //         return;
    //     }
    //
    //     this.selectFeedback.clear();
    //
    //     if (this.isDragging && this.startPoint && this.endPoint) {
    //         var box = this.getSelectBox(this.startPoint, this.endPoint);
    //         var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
    //         this.selectFeedback.add(box, symbol);
    //     }
    //
    //     this.refreshFeedback();
    // },
    //
    // resetEditResultFeedback: function () {
    //     if (!this.defaultFeedback) {
    //         return;
    //     }
    //
    //     this.defaultFeedback.clear();
    //
    //     if (this.editResult && this.editResult.children) {
    //         var geometry = {
    //             type: 'MultiPoint',
    //             coordinates: []
    //         };
    //         var length = this.editResult.children.length;
    //         for (var i = 0; i < length; ++i) {
    //             var feature = this.editResult.children[i];
    //             var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
    //             this.defaultFeedback.add(feature.geometry, nodeSymbol);
    //             geometry.coordinates.push(feature.geometry.coordinates);
    //         }
    //
    //         if (length > 0) {
    //             this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);
    //             var pixelGeometry = this.geojsonTransform.convertGeometry(geometry);
    //             var convexHull = this.geometryAlgorithm.convexHull(pixelGeometry);
    //             var buffer = this.geometryAlgorithm.buffer(convexHull, 20);
    //             this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);
    //             var geographyGeometry = this.geojsonTransform.convertGeometry(buffer);
    //             // 绘制包络线
    //             var bufferSymbol = this.symbolFactory.getSymbol('relationEdit_py_buffer');
    //             this.defaultFeedback.add(geographyGeometry, bufferSymbol);
    //         }
    //     }
    //
    //     this.refreshFeedback();
    // },
    //
    // onLeftButtonDown: function (event) {
    //     if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onLeftButtonDown.apply(this, arguments)) {
    //         return false;
    //     }
    //
    //     this.startPoint = this.mousePoint;
    //     this.isDragging = true;
    //
    //     return true;
    // },
    //
    // onMouseMove: function (event) {
    //     if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onMouseMove.apply(this, arguments)) {
    //         return false;
    //     }
    //
    //     if (!this.isDragging) {
    //         return false;
    //     }
    //
    //     this.endPoint = this.mousePoint;
    //
    //     this.resetSelectFeedback();
    //
    //     return true;
    // },

    // onLeftButtonUp: function (event) {
    //     if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
    //         return false;
    //     }
    //
    //     if (!this.isDragging) {
    //         return false;
    //     }
    //
    //     this.isDragging = false;
    //
    //     var box = this.getSelectBox(this.startPoint, this.endPoint);
    //
    //     this.selectedFeatures = this.featureSelector.selectByGeometry(box, this.selectTypes);
    //
    //     return true;
    // },

});
