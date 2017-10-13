/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.assistantTool.AreaTool = fastmap.uikit.assistantTool.AssistantTool.extend({
    initialize: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'AreaTool';
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
            this.setMouseInfo('单击鼠标左键开始测量面积');
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

        this.drawDashLine();

        this.drawMousePoint();

        this.drawAreaText();

        this.drawFill();

        this.refreshFeedback();
    },

    drawDashLine: function () {
        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        this.dashLineFeedback.add(this.dashLine, lineSymbol);
    },

    drawMousePoint: function () {
        if (this.editResult.isFinish) {
            return;
        }

        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        var vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        this.dashLineFeedback.add(this.mousePoint, vertexSymbol);
    },

    drawAreaText: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 3) {
            return;
        }

        var ring = FM.Util.clone(ls);
        ring.coordinates.push(ring.coordinates[0]);

        var polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates]
        };

        var isSample = this.geometryAlgorithm.isSimple(polygon);

        var area = this.geometryAlgorithm.sphericalArea(polygon);

        var symbol = FM.Util.clone(this.symbolFactory.getSymbol('area_tool_pt_area_text'));
        if (isSample) {
            symbol.marker.text = area.toFixed(2) + '平米';
        } else {
            symbol.marker.text = '自相交';
        }

        this.dashLineFeedback.add(polygon, symbol);
    },

    drawFill: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var length = ls.coordinates.length;
        if (length < 3) {
            return;
        }

        var ring = FM.Util.clone(ls);
        this.geometryAlgorithm.close(ring);

        var polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates]
        };

        var symbol = this.symbolFactory.getSymbol('shapeEdit_py_red');
        this.dashLineFeedback.add(polygon, symbol);
    },

    resetDashLine: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        if (this.editResult.isFinish) {
            return null;
        }

        var length = ls.coordinates.length;
        if (length === 0) {
            return null;
        }

        if (length === 1) {
            return this.getTwoPointDashLine();
        }
        return this.getThreePointDashLine();
    },

    getTwoPointDashLine: function () {
        var ls = this.editResult.finalGeometry;
        var length = ls.coordinates.length;

        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var prevCoordinate = ls.coordinates[0];
        var mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);

        return dashLine;
    },

    getThreePointDashLine: function () {
        var ls = this.editResult.finalGeometry;
        var length = ls.coordinates.length;

        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var prevCoordinate = ls.coordinates[0];
        var nextCoordinate = ls.coordinates[ls.coordinates.length - 1];
        var mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

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
        this.geometryAlgorithm.close(newEditResult.finalGeometry);
        newEditResult.isFinish = true;
        this.createOperation('添加形状点', newEditResult);
    }
});
