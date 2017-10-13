/**
 * Created by xujie3949 on 2016/12/8.
 * polygon绘制工具
 */

fastmap.uikit.shapeEdit.PolygonVertexRemoveTool = fastmap.uikit.shapeEdit.PolygonTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonVertexRemoveTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.PolygonTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFill();

        this.drawFinalGeometry(true);

        this.drawFinalGeometryVertex();

        this.refreshFeedback();
    },

    resetSnapActor: function () {
        this.uninstallSnapActors();

        if (!this.shapeEditor.editResult.isClosed) {
            return;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (ls.coordinates.length <= 4) {
            return;
        }

        var snapActor = this.createNearestVertexSnapActor(ls, true, true);
        this.installSnapActor(snapActor);
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行删除形状点操作，请切换到绘制形状点工具');
            return;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (ls.coordinates.length <= 4) {
            this.setMouseInfo('不能对只有4个点的面进行删除形状点操作，请切换到绘制形状点工具');
            return;
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.PathTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        if (!this.shapeEditor.editResult.isClosed) {
            return true;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return false;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;

        this.delVertex(res.index);

        return true;
    }
});

