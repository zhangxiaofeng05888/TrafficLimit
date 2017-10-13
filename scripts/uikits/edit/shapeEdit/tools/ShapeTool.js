/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.shapeEdit.ShapeTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.operationController = fastmap.uikit.operation.OperationController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.snapController = fastmap.mapApi.snap.SnapController.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.toolTipsController = fastmap.uikit.ToolTipsController();
        this.geojsonTransform = fastmap.mapApi.GeometryTransform.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
        this.snapActors = [];
    },

    onActive: function (map, onFinish, options) {
        if (!fastmap.uikit.MapTool.prototype.onActive.apply(this, arguments)) {
            return false;
        }

        this.startup();
        return true;
    },

    onDeactive: function () {
        this.shutdown();
        return fastmap.uikit.MapTool.prototype.onDeactive.apply(this, arguments);
    },

    startup: function () {
        this.defaultFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.defaultFeedback);
        this.centerInfoFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.centerInfoFeedback);
        this.mouseInfoFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.mouseInfoFeedback);
        this.snapController.startup();

        // add by chenx on 2017-8-1
        // 编辑时，要素选择器增加过滤器，只选择当前大区库的图幅中的数据
        if (this.options.toolOptions && this.options.toolOptions.meshList) {
            var that = this;
            this.featureSelector.setOptions({
                filter: function (feature) {
                    if (feature.geometry) {
                        return that.uikitUtil.testInMeshes(feature.geometry, that.options.toolOptions.meshList);
                    }
                    return true;
                }
            });
        }
    },

    shutdown: function () {
        this.uninstallFeedbacks();
        this.uninstallSnapActors();
        this.snapController.shutdown();
        this.refreshFeedback();

        // add by chenx on 2017-8-1
        // 工具关闭时，清理选择器的过滤器
        this.featureSelector.removeOption('filter');
    },

    resetStatus: function () {
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
        this.snapActors = [];
    },

    installFeedback: function (feedback) {
        this.feedbacks.push(feedback);
        this.feedbackController.add(feedback);
    },

    uninstallFeedback: function (feedback) {
        for (var i = 0; i < this.feedbacks.length; ++i) {
            if (feedback === this.feedbacks[i]) {
                this.feedbacks.splice(i, 1);
                this.feedbackController.del(feedback);
                return;
            }
        }
    },

    uninstallFeedbacks: function () {
        for (var i = 0; i < this.feedbacks.length; ++i) {
            var feedback = this.feedbacks[i];
            this.feedbackController.del(feedback);
        }
        this.feedbacks = [];
    },

    installSnapActor: function (snapActor) {
        this.snapActors.push(snapActor);
        this.snapController.add(snapActor);
    },

    uninstallSnapActor: function (snapActor) {
        for (var i = 0; i < this.snapActors.length; ++i) {
            if (snapActor === this.snapActors[i]) {
                this.snapActors.splice(i, 1);
                this.snapController.del(snapActor);
                return;
            }
        }
    },

    uninstallSnapActors: function () {
        for (var i = 0; i < this.snapActors.length; ++i) {
            var snapActor = this.snapActors[i];
            this.snapController.del(snapActor);
        }
        this.snapActors = [];
    },

    refreshFeedback: function () {
        this.feedbackController.refresh();
    },

    createFeatureSnapActor: function (layerId, exceptions) {
        if (!layerId) {
            throw new Error('FeatureSnapActor必须指定捕捉的层');
        }

        var snapActor = new fastmap.mapApi.snap.FeatureSnapActor();
        snapActor.layerId = layerId;

        if (exceptions) {
            for (var i = 0; i < exceptions.length; ++i) {
                var exception = exceptions[i];
                snapActor.addSnapException(exception);
            }
        }

        return snapActor;
    },

    createGivenFeatureSnapActor: function (features) {
        if (!features) {
            throw new Error('GivenFeatureSnapActor必须指定捕捉的要素');
        }

        var snapActor = new fastmap.mapApi.snap.GivenFeatureSnapActor();
        snapActor.setFeatures(features);

        return snapActor;
    },

    createGivenPointSnapActor: function (pairs) {
        if (!pairs) {
            throw new Error('GivenPointSnapActor必须指定待捕捉的点');
        }

        var snapActor = new fastmap.mapApi.snap.GivenPointSnapActor();
        snapActor.pairs = pairs;

        return snapActor;
    },

    createNearestLocationSnapActor: function (geometry) {
        if (!geometry) {
            throw new Error('NearestLocationSnapActor必须指定捕捉的几何');
        }

        var snapActor = new fastmap.mapApi.snap.NearestLocationSnapActor();
        snapActor.geometry = geometry;

        return snapActor;
    },

    createNearestVertexSnapActor: function (geometry, canSnapStart, canSnapEnd) {
        if (!geometry) {
            throw new Error('NearestVertexSnapActor必须指定捕捉的几何');
        }

        var snapActor = new fastmap.mapApi.snap.NearestVertexSnapActor();
        snapActor.geometry = geometry;
        snapActor.canSnapStart = canSnapStart;
        snapActor.canSnapEnd = canSnapEnd;

        return snapActor;
    },

    createFullScreenFeatureSnapActor: function (layerId, exceptions) {
        if (!layerId) {
            throw new Error('FeatureSnapActor必须指定捕捉的层');
        }

        var snapActor = new fastmap.mapApi.snap.FullScreenFeatureSnapActor();
        snapActor.layerId = layerId;

        if (exceptions) {
            for (var i = 0; i < exceptions.length; ++i) {
                var exception = exceptions[i];
                snapActor.addSnapException(exception);
            }
        }

        return snapActor;
    },

    refresh: function () {
        throw new Error('未重写refresh方法');
    },

    setCenterInfo: function (msg, duration, color) {
        if (!this.centerInfoFeedback) {
            return;
        }

        this.centerInfoFeedback.clear();
        if (!msg) {
            this.refreshFeedback();
            return;
        }

        var symbol = this.symbolFactory.getSymbol('relationEdit_tx_center_info');
        symbol = FM.Util.clone(symbol);
        symbol.text = msg;
        if (color) {
            symbol.color = color;
        }
        var latlng = this.map.getBounds().getCenter();
        var point = this.latlngToPoint(latlng);
        this.centerInfoFeedback.add(point, symbol);
        this.refreshFeedback();

        var self = this;
        if (duration) {
            setTimeout(function () {
                self.setCenterInfo('');
            }, duration);
        }
    },

    setCenterError: function (msg, duration) {
        this.setCenterInfo(msg, duration);
    },

    setMouseInfo: function (msg, color) {
        this.mouseInfo = msg;
        this.mouseInfoColor = color || 'blue';
        this.resetMouseInfoFeedback();
    },

    resetMouseInfoFeedback: function () {
        this.mouseInfoFeedback.clear();
        if (!this.mouseInfo || !this.mousePoint) {
            this.refreshFeedback();
            return;
        }

        var symbol = this.symbolFactory.getSymbol('relationEdit_tx_mouse_info');
        symbol = FM.Util.clone(symbol);
        symbol.text = this.mouseInfo;
        symbol.color = this.mouseInfoColor;
        this.mouseInfoFeedback.add(this.mousePoint, symbol);
        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        // 和服务端存的数据精度保持一致；
        var mousePoint = this.latlngToPoint(event.latlng);

        if (this.options.toolOptions && this.options.toolOptions.meshList) {
            if (!this.uikitUtil.testInMeshes(mousePoint, this.options.toolOptions.meshList)) {
                return false;
            }
        }

        this.mousePoint = mousePoint;

        this.resetMouseInfoFeedback();

        return true;
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        if (this.options.toolOptions && this.options.toolOptions.meshList) {
            return this.uikitUtil.testInMeshes(this.mousePoint, this.options.toolOptions.meshList);
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (this.options.toolOptions && this.options.toolOptions.meshList) {
            return this.uikitUtil.testInMeshes(this.mousePoint, this.options.toolOptions.meshList);
        }

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                var options = this.shapeEditor.originEditResult;
                var checkController = this.shapeEditor.originEditResult.checkController;
                options.checkController = null;
                var newEditResult = FM.Util.clone(options);
                newEditResult.checkController = checkController;
                options.checkController = checkController;
                this.shapeEditor.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                if (this.onFinish) {
                    this.onFinish(null);
                }
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
    },

    latlngToPoint: function (latlng) {
        return {
            type: 'Point',
            coordinates: [
                latlng.lng,
                latlng.lat
            ]
        };
    },

    convertToPixel: function (map, tileInfo, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var point = map.project([
            y,
            x
        ]);
        return [
            point.x,
            point.y
        ];
    },

    convertToGeography: function (map, tileInfo, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var lnglat = map.unproject([
            x,
            y
        ]);
        return [
            lnglat.lng,
            lnglat.lat
        ];
    }
});
