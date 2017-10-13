/**
 * Created by xujie3949 on 2016/12/8.
 * polygon移动形状点工具
 */

fastmap.uikit.shapeEdit.PolygonVertexMoveTool = fastmap.uikit.shapeEdit.PolygonTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonVertexMoveTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.selectedVertexIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.PolygonTool.prototype.startup.apply(this, arguments);

        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.resetStatus.apply(this, arguments);

        this.dashLineFeedback = null;
        this.dashLine = null;
        this.selectedVertexIndex = null;
        this.isDragging = false;
        this.nearestPoint = null;
    },

    refresh: function () {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetMouseInfo();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFill();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawMouseNearestPoint();

        this.refreshFeedback();
    },

    drawMouseNearestPoint: function () {
        if (!this.isDragging || !this.nearestPoint) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(this.nearestPoint, symbol);
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (this.dashLine) {
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
        }

        this.refreshFeedback();
    },

    resetDashLine: function () {
        if (!this.isDragging) {
            return;
        }

        if (this.selectedVertexIndex !== null) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        }
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行移动形状点操作，请切换到添加形状点工具');
            return;
        }
    },

    getDashLineByVertexIndex: function (index) {
        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var ls = this.shapeEditor.editResult.finalGeometry;

        var prevCoordinate = null;
        var nextCoordinate = null;
        var mouseCoordinate = null;

        if (index === 0 || index === ls.coordinates.length - 1) {
            prevCoordinate = ls.coordinates[1];
            nextCoordinate = ls.coordinates[ls.coordinates.length - 2];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        } else {
            prevCoordinate = ls.coordinates[index - 1];
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        }

        return dashLine;
    },

    getSelectedVertexIndexFromNearestLoactions: function (nearstLocation) {
        var prevPoint = nearstLocation.previousPoint;
        var nextPoint = nearstLocation.nextPoint;
        var point = nearstLocation.point;

        var prevDis = this.geometryAlgorithm.distance(point, prevPoint);
        var nextDis = this.geometryAlgorithm.distance(point, nextPoint);

        if (prevDis < nextDis) {
            return nearstLocation.previousIndex;
        }

        return nearstLocation.nextIndex;
    },

    getNearestLocations: function (point) {
        if (!point) {
            return null;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        return this.geometryAlgorithm.nearestLocations(point, ls);
    },

    getPointByIndex: function (index, nearestLocations) {
        if (index === nearestLocations.previousIndex) {
            return nearestLocations.previousPoint;
        }
        if (index === nearestLocations.nextIndex) {
            return nearestLocations.nextPoint;
        }
        return null;
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        this.isDragging = true;

        var nearestLocations = this.getNearestLocations(this.mousePoint);
        this.selectedVertexIndex = this.getSelectedVertexIndexFromNearestLoactions(nearestLocations);
        this.nearestPoint = this.getPointByIndex(this.selectedVertexIndex, nearestLocations);

        this.refresh();

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (!this.isDragging) {
            return false;
        }

        this.isDragging = false;
        var res = this.snapController.snap(this.mousePoint);
        this.moveVertex(this.selectedVertexIndex, this.mousePoint, res);

        return true;
    }
});

