/**
 * Created by xujie3949 on 2016/12/8.
 * link两端添加形状点工具
 */

fastmap.uikit.shapeEdit.PathVertexAddTool = fastmap.uikit.shapeEdit.PathTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PathVertexAddTool';
        this.addDirection = 'tail';
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.resetStatus.apply(this, arguments);

        this.addDirection = 'tail';
    },

    refresh: function () {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetSnapActor();
    },

    resetSnapActor: function () {
        this.uninstallSnapActors();

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        fastmap.uikit.shapeEdit.PathTool.prototype.resetSnapActor.apply(this, arguments);
    },

    resetDashLine: function () {
        this.dashLine = null;

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var length = ls.coordinates.length;
        if (length === 0) {
            return;
        }

        if (!this.mousePoint) {
            return;
        }

        var startCoordinate = null;
        if (this.addDirection === 'tail') {
            startCoordinate = ls.coordinates[length - 1];
        } else {
            startCoordinate = ls.coordinates[0];
        }

        var endCoordinate = this.mousePoint.coordinates;

        this.dashLine = {
            type: 'LineString',
            coordinates: [startCoordinate, endCoordinate]
        };
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (this.dashLine !== null) {
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
            this.refreshFeedback();
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        if (this.shapeEditor.editResult.changeDirection) {
            this.addDirection = this.getAddDirection(this.mousePoint);
        }

        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    },

    getAddDirection: function (point) {
        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return 'tail';
        }

        var length = ls.coordinates.length;
        if (length < 2) {
            return 'tail';
        }

        var sPoint = this.coordinatesToPoint(ls.coordinates[0]);
        var ePoint = this.coordinatesToPoint(ls.coordinates[length - 1]);

        var sDis = this.geometryAlgorithm.distance(sPoint, point);
        var eDis = this.geometryAlgorithm.distance(ePoint, point);

        return eDis < sDis ? 'tail' : 'head';
    },

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);

        if (this.addDirection === 'tail') {
            this.addPointToTail(res);
        } else {
            this.addPointToHead(res);
        }

        return true;
    },

    addPointToTail: function (res) {
        var ls = this.shapeEditor.editResult.finalGeometry;
        this.addVertex(ls.coordinates.length, this.mousePoint, res);
    },

    addPointToHead: function (res) {
        this.addVertex(0, this.mousePoint, res);
    }
});
