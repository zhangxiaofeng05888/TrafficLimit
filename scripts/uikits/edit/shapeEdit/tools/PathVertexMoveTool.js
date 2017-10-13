/**
 * Created by xujie3949 on 2016/12/8.
 * links移动形状点工具
 */

fastmap.uikit.shapeEdit.PathVertexMoveTool = fastmap.uikit.shapeEdit.PathTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PathVertexMoveTool';
        this.selectedVertexIndex = null;
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.resetStatus.apply(this, arguments);

        this.selectedVertexIndex = null;
    },

    refresh: function () {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行移动点操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 2) {
            this.setMouseInfo('至少需要2个形状点才能进行移动点操作，请切换到延长线工具');
            return;
        }
    },

    resetDashLine: function () {
        if (!this.isDragging) {
            return;
        }

        if (this.selectedVertexIndex !== null) {
            this.dashLine = this.getDashLineByVertexIndex(this.selectedVertexIndex);
        }
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

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        this.isDragging = true;

        var nearestLocations = this.getNearestLocations(this.mousePoint);
        this.selectedVertexIndex = this.getSelectedVertexIndexFromNearestLoactions(nearestLocations);
        this.nearestPoint = this.getPointByIndex(this.selectedVertexIndex, nearestLocations);

        this.refresh();

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onMouseMove.apply(this, arguments)) {
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
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onLeftButtonUp.apply(this, arguments)) {
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
