/**
 * Created by xujie3949 on 2016/12/8.
 * polygon形状点插入工具
 */

fastmap.uikit.shapeEdit.PolygonVertexInsertTool = fastmap.uikit.shapeEdit.PolygonTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PolygonTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonVertexInsertTool';
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

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.refreshFeedback();
    },

    resetSnapActor: function () {
        this.uninstallSnapActors();

        if (!this.shapeEditor.editResult.isClosed) {
            return;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;

        var snapActor = this.createNearestLocationSnapActor(ls);
        this.installSnapActor(snapActor);
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        if (!this.shapeEditor.editResult.isClosed) {
            this.setMouseInfo('不能对未闭合的面进行插入形状点操作，请切换到添加形状点工具');
            return;
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.PolygonTool.prototype.onLeftButtonClick.apply(this, arguments)) {
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

        var nearestLoations = this.geometryAlgorithm.nearestLocations(res.point, ls);

        this.addVertex(nearestLoations.nextIndex, res.point);

        return true;
    }
});

