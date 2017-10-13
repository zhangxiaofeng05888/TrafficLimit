/**
 * Created by zhongxiaoming on 2017/8/22.
 */

fastmap.uikit.complexEdit.AdjustImageTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'AdjustImageTool';
        this.snapActor = null;

        this.descLine = null;
        this.ascLine = null;
        this.traceLint = null;
    },

    startup: function () {
        this.resetStatus();
        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);
        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);
        this.descLine = null;
        this.ascLine = null;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetMouseInfo();
    },


    resetMouseInfo: function () {
        if (!this.editResult.startPoint) {
            this.setMouseInfo('点击选择起始点位!');
        } else {
            if (!this.editResult.isFinish) {
                this.setMouseInfo('放开左键选定终点!');
            } else {
                this.setMouseInfo('按空格保存，或重新操作');
            }
        }
    },


    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        if (this.editResult.finalGeometry.coordinates.length == 2) {
            this.setLinkDirectSymboal();
        }
        this.refreshFeedback();
    },
    setLinkDirectSymboal: function () {
        var triangleMarkerSymbolAsc = FM.Util.clone(this.symbolFactory.getSymbol('relationEdit_ls_line_point_direct'));
        triangleMarkerSymbolAsc.symbols[0].marker.color = 'red';
        triangleMarkerSymbolAsc.symbols[1].color = 'red';
        this.defaultFeedback.add(this.traceLine, triangleMarkerSymbolAsc);
    },
    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (this.editResult.finalGeometry.coordinates.length < 1) {
            return false;
        }
        this.resetMouseInfo();
        if (this.editResult.isFinish) {
            return false;
        }
        this.traceLine = this.resetLine();
        this.editResult.finalGeometry = this.traceLine;

        this.resetFeedback();
        this.refreshFeedback();
        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.assistantTool.AssistantTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }
        this.editResult.bBox = this._getBbox(this.map);
        this.editResult.endPoint = this.mousePoint.coordinates;
        this.editResult.ePoint = event.containerPoint;
        this.resetMouseInfo();
        this.onAddVertexFinish();
        return true;
    },

    _getBbox: function (map) {
        return map.getBounds()._southWest.lng + ',' + map.getBounds()._southWest.lat + ',' + map.getBounds()._northEast.lng + ',' + map.getBounds()._northEast.lat;
    },

    onAddVertex: function () {
        if (this.editResult.isFinish) {
            // this.editResult = this.getEmptyEditResult();
        }
        this.editResult.finalGeometry.coordinates.push(this.mousePoint.coordinates);
    },
    onAddVertexFinish: function () {
        this.editResult.isFinish = true;
    },
    resetLine: function () {
        var line = {
            type: 'LineString',
            coordinates: []
        };

        if (this.editResult.isFinish) {
            return null;
        }

        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            return null;
        }

        if (!this.mousePoint) {
            return null;
        }

        var firstCoordinate = ls.coordinates[0];
        this.editResult.startPoint = ls.coordinates[0];
        line.coordinates.push(firstCoordinate);
        line.coordinates.push(this.mousePoint.coordinates);
        return line;
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        this.editResult.sPoint = event.containerPoint;
        this.onAddVertex();
        return true;
    },

    onKeyUp: function (event) {
        var key = event.key;
        switch (key) {
            case 'Escape':
                var newEditResult = FM.Util.clone(this.options.editResult);
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                if (this.onFinish) {
                    this.onFinish(this.editResult);
                }
                break;
            default:
                break;
        }

        return true;
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    }
});
