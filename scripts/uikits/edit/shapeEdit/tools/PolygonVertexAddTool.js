/**
 * Created by xujie3949 on 2016/12/8.
 * polygon添加形状点工具
 */

fastmap.uikit.shapeEdit.PolygonVertexAddTool = fastmap.uikit.shapeEdit.PolygonTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonVertexAddTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
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

        this.refreshFeedback();
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
        this.dashLine = null;

        if (this.shapeEditor.editResult.isClosed) {
            return;
        }

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

        if (length === 1) {
            this.dashLine = this.getTwoPointDashLine();
        } else {
            this.dashLine = this.getThreePointDashLine();
        }
    },

    resetMouseInfo: function () {
        if (!this.shapeEditor.editResult.finalGeometry.coordinates.length) {
            this.setMouseInfo('点击地图开始绘面');
            return;
        }
        if (!this.shapeEditor.editResult.isClosed && this.shapeEditor.editResult.finalGeometry.coordinates.length < 3) {
            this.setMouseInfo('请点击继续绘制');
            return;
        }
        if (!this.shapeEditor.editResult.isClosed && this.shapeEditor.editResult.finalGeometry.coordinates.length >= 3) {
            this.setMouseInfo('继续绘制或者按鼠标滚轮结束绘制');
            return;
        }
        if (this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('面已经闭合,可以按ESC重新绘制或者切换到其他工具进行修形');
            return;
        }
    },

    closeGeometry: function () {
        if (this.shapeEditor.editResult.finalGeometry.coordinates.length < 3) {
            this.setCenterInfo('面至少有3个点才能闭合', 1000);
            return true;
        }

        if (this.shapeEditor.editResult.isClosed) {
            return true;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        this.addVertex(ls.coordinates.length, this.coordinatesToPoint(ls.coordinates[0]));
        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'c':   // 闭合几何
                this.closeGeometry();
                break;
            default:
                break;
        }

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        if (this.shapeEditor.editResult.isClosed) {
            return true;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        this.addVertex(ls.coordinates.length, this.mousePoint);

        return true;
    },

    onMiddleButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onMiddleButtonClick.apply(this, arguments)) {
            return false;
        }

        return this.closeGeometry();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    }
});

