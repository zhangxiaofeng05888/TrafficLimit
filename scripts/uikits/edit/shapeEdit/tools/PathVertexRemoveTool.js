/**
 * Created by xujie3949 on 2016/12/8.
 * links删除中间形状点工具
 */

fastmap.uikit.shapeEdit.PathVertexRemoveTool = fastmap.uikit.shapeEdit.PathTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.PathTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PathVertexRemoveTool';
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

        var snapActor = this.createNearestVertexSnapActor(ls, false, false);
        this.installSnapActor(snapActor);
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            this.setMouseInfo('不能对空几何进行删除点操作，请切换到延长线工具');
            return;
        }

        if (ls.coordinates.length < 3) {
            this.setMouseInfo('至少需要3个形状点才能进行删除点操作，请切换到延长线工具或平滑修形工具');
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
        var index = res.index;
        if (index === 0 || index === ls.coordinates.length - 1) {
            return false;
        }

        this.delVertex(index);

        return true;
    }
});
