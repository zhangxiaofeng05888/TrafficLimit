/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.assistantTool.AssistantTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.operationController = fastmap.uikit.operation.OperationController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.geojsonTransform = fastmap.mapApi.GeometryTransform.getInstance();
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.editResult = null;
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
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
        this.editResult = this.getEmptyEditResult();
        this.defaultFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.defaultFeedback);
        this.centerInfoFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.centerInfoFeedback);
        this.mouseInfoFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.mouseInfoFeedback);
        this.operationController.clear();
    },

    shutdown: function () {
        this.uninstallFeedbacks();
        this.operationController.clear();
        this.refreshFeedback();
    },

    getEmptyEditResult: function () {
        return {
            isFinish: false,
            finalGeometry: {
                type: 'LineString',
                coordinates: []
            },
            lenth: 0,
            area: 0,
            angle: 0
        };
    },

    resetStatus: function () {
        this.editResult = null;
        this.defaultFeedback = null;
        this.centerInfoFeedback = null;
        this.mouseInfoFeedback = null;
        this.mousePoint = null;
        this.mouseInfo = null;
        this.mouseInfoColor = null;
        this.feedbacks = [];
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

    refreshFeedback: function () {
        this.feedbackController.refresh();
    },

    createOperation: function (name, newEditResult) {
        var operation = new fastmap.uikit.operation.EditResultOperation(
            name,
            this.onRedo,
            this.onUndo,
            this.editResult,
            newEditResult);
        if (!operation.canDo()) {
            this.refresh();
            var err = operation.getError();
            this.setCenterError(err, 2000);
            return;
        }
        this.operationController.add(operation);
    },

    onRedo: function (oldEditResult, newEditResult) {
        throw new Error('未重写onRedo方法');
    },

    onUndo: function (oldEditResult, newEditResult) {
        throw new Error('未重写onUndo方法');
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

        this.mousePoint = this.latlngToPoint(event.latlng);

        this.resetMouseInfoFeedback();

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                var newEditResult = this.getEmptyEditResult();
                this.createOperation('恢复初始状态', newEditResult);
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

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
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
