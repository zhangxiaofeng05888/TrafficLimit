/**
 * Created by linglong on 2016/12/8.
 * 自由画笔工具
 */

fastmap.uikit.shapeEdit.TipBorderTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'TipBorderTool';
        this.mouseDownFlag = false;
        // 目的是为了保存每次画的线;
        this.runTimeLineArr = [];
    },

    startup: function () {
        this.resetStatus();
        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);
        this.drawFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.drawFeedback);
        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);
        this.drawFeedback = null;
        this.mouseDownFlag = false;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetMouseInfo();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.shapeEditor.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.shapeEditor.editResult = oldEditResult;
        this.refresh();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        this.drawFeedback.clear();
        this.drawStartNodeGeometry();
        this.drawFinalGeometry();
        this.refreshFeedback();
    },

    resetdrawFeedback: function () {
        if (!this.drawFeedback) {
            return;
        }
        this.drawFeedback.clear();
        this.drawRuntimeGeometry();
        this.refreshFeedback();
    },

    resetMouseInfo: function () {
        if (this.mouseDownFlag) {
            this.setMouseInfo('');
            return;
        }
        if (!this.shapeEditor.editResult.startNode) {
            this.setMouseInfo('按下鼠标左键开始制作接边标识!');
            return;
        }
        if (this.shapeEditor.editResult.finalGeometry.coordinates.length) {
            this.setMouseInfo('继续绘制接边标识或按空格进行保存!');
            return;
        }
    },

    // 绘制当前画的线;
    drawRuntimeGeometry: function () {
        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
        var lineString = { type: 'LineString', coordinates: this.runTimeLineArr };
        this.drawFeedback.add(lineString, lineSymbol);
    },

    // 绘制整体图形;
    drawFinalGeometry: function () {
        if (!this.shapeEditor.editResult.finalGeometry) {
            return;
        }
        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
        var mutiLineGeo = this.shapeEditor.editResult.finalGeometry.coordinates;
        for (var i = 0; i < mutiLineGeo.length; i++) {
            var tempLineGeo = { type: 'LineString', coordinates: mutiLineGeo[i] };
            this.defaultFeedback.add(tempLineGeo, lineSymbol);
        }
    },

    drawStartNodeGeometry: function () {
        if (!this.shapeEditor.editResult.startNode) {
            return;
        }
        var sVertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_start_vertex');
        this.defaultFeedback.add(this.shapeEditor.editResult.startNode, sVertexSymbol);
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        this.mouseDownFlag = true;
        if (!this.shapeEditor.editResult.startNode) {
            newEditResult.startNode = {
                type: 'Point',
                coordinates: this.mousePoint.coordinates
            };
            this.shapeEditor.createOperation('确定标识起点', newEditResult);
        }

        if (!this.shapeEditor.editResult.finalGeometry) {
            newEditResult.finalGeometry = {
                type: 'MultiLineString',
                coordinates: []
            };
        }
        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        if (this.mouseDownFlag) {
            this.runTimeLineArr.push(this.mousePoint.coordinates);
            this.resetdrawFeedback();
            this.resetMouseInfo();
        }
        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }
        this.mouseDownFlag = false;

        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        if (this.runTimeLineArr.length >= 5) {
            newEditResult.finalGeometry.coordinates.push(this.runTimeLineArr);
            this.shapeEditor.createOperation('完成一条标记线', newEditResult);
        } else if (this.runTimeLineArr.length < 5 && !newEditResult.finalGeometry.coordinates.length) {
            newEditResult.startNode = null;
            this.shapeEditor.createOperation('如果第一次点了没画不创建起点', newEditResult);
        }

        this.runTimeLineArr = [];
        return true;
    }
});
