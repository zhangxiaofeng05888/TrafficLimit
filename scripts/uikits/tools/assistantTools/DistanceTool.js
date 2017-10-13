/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.assistantTool.DistanceTool = fastmap.uikit.assistantTool.AssistantTool.extend({
    initialize: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'DistanceTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.assistantTool.AssistantTool.prototype.startup.apply(this, arguments);

        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.resetStatus.apply(this, arguments);

        this.dashLineFeedback = null;
        this.dashLine = null;
    },

    refresh: function () {
        this.dashLine = this.resetDashLine();
        this.resetFeedback();
        this.resetDashLineFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            this.setMouseInfo('单击鼠标左键开始测量距离');
            return;
        }
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawLengthText();

        this.refreshFeedback();
    },

    drawFinalGeometry: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('distance_tool_ls_edge');
        this.defaultFeedback.add(ls, lineSymbol);
    },

    drawFinalGeometryVertex: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        for (var i = 0; i < ls.coordinates.length; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            this.defaultFeedback.add(vertex, vertexSymbol);
        }
    },

    drawLengthText: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var totalLength = 0;
        for (var i = 0; i < ls.coordinates.length - 1; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            var nextVertex = this.coordinatesToPoint(ls.coordinates[i + 1]);
            var length = this.geometryAlgorithm.sphericalDistance(vertex, nextVertex);
            totalLength += length;
            var symbol = FM.Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
            symbol.text = length.toFixed(2) + '/' + totalLength.toFixed(2) + '米';
            this.setTextSymbolOffset(symbol);
            this.defaultFeedback.add(nextVertex, symbol);
        }
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        this.drawDashLine();

        this.drawMousePoint();

        this.refreshFeedback();
    },

    drawDashLine: function () {
        var length = this.geometryAlgorithm.sphericalLength(this.dashLine);
        var totalLength = this.editResult.length + length;
        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        var textSymbol = FM.Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
        textSymbol.text = length.toFixed(2) + '/' + totalLength.toFixed(2) + '米';
        this.setTextSymbolOffset(textSymbol);
        this.dashLineFeedback.add(this.dashLine, lineSymbol);
        this.dashLineFeedback.add(this.mousePoint, textSymbol);
    },

    drawMousePoint: function () {
        var vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        this.dashLineFeedback.add(this.mousePoint, vertexSymbol);
    },

    setTextSymbolOffset: function (symbol) {
        var size = symbol.getOriginBound().getSize();
        symbol.offsetX = size.width / 2;
        symbol.offsetY = -size.height;
    },

    resetDashLine: function () {
        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        if (this.editResult.isFinish) {
            return null;
        }

        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            return null;
        }

        if (!this.mousePoint) {
            return null;
        }

        var lastCoordinate = ls.coordinates[ls.coordinates.length - 1];
        dashLine.coordinates.push(lastCoordinate);
        dashLine.coordinates.push(this.mousePoint.coordinates);
        return dashLine;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.assistantTool.AssistantTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.dashLine = this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.assistantTool.AssistantTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.onAddVertex();

        return true;
    },

    onLeftButtonDblClick: function (event) {
        if (!fastmap.uikit.assistantTool.AssistantTool.prototype.onLeftButtonDblClick.apply(this, arguments)) {
            return false;
        }

        this.onAddVertexFinish();

        return true;
    },

    onAddVertex: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        if (newEditResult.isFinish) {
            newEditResult = this.getEmptyEditResult();
        }
        newEditResult.finalGeometry.coordinates.push(this.mousePoint.coordinates);
        newEditResult.length = this.geometryAlgorithm.sphericalLength(newEditResult.finalGeometry);
        this.createOperation('添加形状点', newEditResult);
    },

    onAddVertexFinish: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.isFinish = true;
        this.createOperation('添加形状点', newEditResult);
    }
});
