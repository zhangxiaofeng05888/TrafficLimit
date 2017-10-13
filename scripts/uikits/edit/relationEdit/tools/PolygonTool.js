/**
 * Created by zhaohang on 2017/5/3.
 */

fastmap.uikit.relationEdit.PolygonTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
        this.name = 'PolygonTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);
        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);
        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.dashLineFeedback = null;
    },

    refresh: function () {
        this.resetDashLine();
        this.resetDashLineFeedback();
        this.resetFeedback();
        this.resetPanel();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetPanel: function () {
        if (!this.editResult.editing) {
            this.openTaskListPanel();
        } else {
            this.closeTaskListPanel();
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFill();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawTips();

        this.refreshFeedback();
    },

    drawFinalGeometry: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
        this.defaultFeedback.add(ls, lineSymbol);
    },

    drawFinalGeometryVertex: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

        for (var i = 0; i < ls.coordinates.length; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            this.defaultFeedback.add(vertex, vertexSymbol);
        }
    },

    drawTips: function () {
        var tipsArray = this.editResult.tipsArray;
        var pointData = {
            type: 'Point',
            coordinates: []
        };
        var pointSymbol = this.symbolFactory.getSymbol('pt_tips');
        for (var i = 0; i < tipsArray.length; i++) {
            if (tipsArray[i].geometry.type === 'MultiPoint') {
                for (var j = 0, lenJ = tipsArray[i].geometry.coordinates.length; j < lenJ; j++) {
                    pointData.coordinates = tipsArray[i].geometry.coordinates[j];
                    this.defaultFeedback.add(pointData, pointSymbol);
                }
            } else if (tipsArray[i].geometry.type === 'GeometryCollection') {
                for (var n = 0, lenN = tipsArray[i].geometry.geometries.length; n < lenN; n++) {
                    if (tipsArray[i].geometry.geometries[n].type === 'Point') {
                        pointData.coordinates = tipsArray[i].geometry.geometries[n].coordinates;
                        this.defaultFeedback.add(pointData, pointSymbol);
                    }
                }
            } else {
                this.defaultFeedback.add(tipsArray[i].geometry, pointSymbol);
            }
        }
    },

    drawFill: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var length = ls.coordinates.length;
        if (length < 3) {
            return;
        }

        var ring = FM.Util.clone(ls);
        this.geometryAlgorithm.close(ring);

        var polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates]
        };

        var symbol = this.symbolFactory.getSymbol('shapeEdit_py_red');
        this.defaultFeedback.add(polygon, symbol);
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

        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var length = ls.coordinates.length;
        if (length === 0) {
            return;
        }

        if (length === 1) {
            this.dashLine = this.getTwoPointDashLine();
        } else {
            this.dashLine = this.getThreePointDashLine();
        }
    },

    getTwoPointDashLine: function () {
        var ls = this.editResult.finalGeometry;
        var length = ls.coordinates.length;

        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var prevCoordinate = ls.coordinates[0];
        var mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);

        return dashLine;
    },

    getThreePointDashLine: function () {
        var ls = this.editResult.finalGeometry;
        var length = ls.coordinates.length;

        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var prevCoordinate = ls.coordinates[0];
        var nextCoordinate = ls.coordinates[ls.coordinates.length - 1];
        var mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

        return dashLine;
    },

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        var newEditResult = FM.Util.clone(this.editResult);
        switch (key) {
            case 'a':
                var ring = newEditResult.finalGeometry;
                var tipsArray = [];
                this.geometryAlgorithm.close(ring);
                var polygonGeometry = {
                    type: 'Polygon',
                    coordinates: [ring.coordinates]
                };
                var features = this.featureSelector.selectByGeometry(polygonGeometry, null);
                for (var i = 0; i < features.length; i++) {
                    if (features[i].type === 'tips' || features[i].properties.geoLiveType === 'IXPOI') {
                        tipsArray.push(features[i]);
                    }
                }
                newEditResult.tipsArray = tipsArray;
                newEditResult.editing = false;
                this.createOperation('获取范围内Tips', newEditResult);
                break;
            default:
                break;
        }

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        if (!this.editResult.editing) {
            return false;
        }
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.finalGeometry.coordinates.push(this.mousePoint.coordinates);
        this.createOperation('添加形状点', newEditResult);

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        if (!this.editResult.editing) {
            return false;
        }
        this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    },

    closeTaskListPanel: function () {
        var options = {
            panelName: 'createTaskListPanel'
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, options); // 关闭浮动面板
    },

    openTaskListPanel: function () {
        var options = {
            panelName: 'createTaskListPanel',
            data: {}
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options); // 打开右面浮动面板
        this.eventController.fire(L.Mixin.EventTypes.PARTSREFRESH, options); // 右面面板赋默认值
    },

    onPartsSelectedChanged: function (obj) {
        this.editResult.idObj = obj;
    }
});
