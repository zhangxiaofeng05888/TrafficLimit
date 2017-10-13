/**
 * Created by xujie3949 on 2016/12/8.
 * polygon工具基类
 */

fastmap.uikit.shapeEdit.PolygonTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonTool';
    },

    drawFinalGeometry: function () {
        var ls = FM.Util.clone(this.shapeEditor.editResult.finalGeometry);
        if (!ls) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
        this.defaultFeedback.add(ls, lineSymbol);
    },

    drawFinalGeometryVertex: function () {
        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

        var n = ls.coordinates.length;
        if (this.shapeEditor.editResult.isClose) {
            n -= 1;
        }

        for (var i = 0; i < n; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            this.defaultFeedback.add(vertex, vertexSymbol);
        }
    },

    drawFill: function () {
        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var length = ls.coordinates.length;
        if (length < 3) {
            return;
        }

        var ring = FM.Util.clone(ls);
        if (!this.shapeEditor.editResult.isClosed) {
            this.geometryAlgorithm.close(ring);
        }

        var polygon = {
            type: 'Polygon',
            coordinates: [ring.coordinates]
        };

        var symbol = this.symbolFactory.getSymbol('shapeEdit_py_red');
        this.defaultFeedback.add(polygon, symbol);
    },

    getTwoPointDashLine: function () {
        var ls = this.shapeEditor.editResult.finalGeometry;
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
        var ls = this.shapeEditor.editResult.finalGeometry;
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

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return false;
        }

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return false;
        }

        return true;
    },

    onKeyUp: function (event) {
        var key = event.key;
        switch (key) {
            case 'Escape':
                this.isDragging = false;
                var newEditResult = this.shapeEditor.originEditResult.clone();
                this.shapeEditor.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                this.isDragging = false;
                if (this.onFinish) {
                    this.onFinish(null);
                }
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.isDragging = false;
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.isDragging = false;
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    },

    createOperation: function (operation) {
        if (!operation.canDo()) {
            this.refresh();
            var err = operation.getError();
            this.setCenterError(err, 2000);
            return;
        }
        this.operationController.add(operation);
    },

    addVertex: function (index, point, snap) {
        var opereation = new fastmap.uikit.operation.PolygonVertexAddOperation(
            this.shapeEditor,
            index,
            point
        );

        this.createOperation(opereation);
    },

    delVertex: function (index) {
        var opereation = new fastmap.uikit.operation.PolygonVertexRemoveOperation(
            this.shapeEditor,
            index,
            null
        );

        this.createOperation(opereation);
    },

    moveVertex: function (index, point, snap) {
        var opereation = new fastmap.uikit.operation.PolygonVertexMoveOperation(
            this.shapeEditor,
            index,
            point
        );

        this.createOperation(opereation);
    }
});

