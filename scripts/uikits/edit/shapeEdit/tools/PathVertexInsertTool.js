/**
 * Created by xujie3949 on 2016/12/8.
 * link插入中间形状点工具
 */

fastmap.uikit.shapeEdit.PathVertexInsertTool = fastmap.uikit.shapeEdit.PathTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PathVertexInsertTool';
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    resetSnapActor: function () {
        this.uninstallSnapActors();
        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return;
        }

        var snapActor = this.createNearestLocationSnapActor(ls);
        this.installSnapActor(snapActor);
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行插入形状点操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 2) {
            this.setMouseInfo('至少需要2个形状点才能进行插入形状点操作，请切换到延长线工具');
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

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return false;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;

        var nearestLoations = this.geometryAlgorithm.nearestLocations(res.point, ls);

        this.addVertex(nearestLoations.nextIndex, res.point, null);

        return true;
    }
});
