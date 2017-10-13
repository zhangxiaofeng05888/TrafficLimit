/**
 * Created by xujie3949 on 2016/12/8.
 * link平滑修行工具
 */

fastmap.uikit.shapeEdit.PathTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PathTool';
        this.nodeSnapActor = null;
        this.linkSnapActor = null;
        this.dashLineFeedback = null;
        this.threshold = null;
        this.nearestPoint = null;
        this.dashLine = null;
        this.isDragging = false;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);

        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);
        this.threshold = 10;

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);

        this.nodeSnapActor = null;
        this.linkSnapActor = null;
        this.dashLineFeedback = null;
        this.threshold = null;
        this.nearestPoint = null;
        this.dashLine = null;
        this.isDragging = false;
    },

    refresh: function () {
        this.resetFeedback();
    },

    resetSnapActor: function () {
        var actorInfos = this.shapeEditor.editResult.snapActors;
        for (var i = 0; i < actorInfos.length; ++i) {
            var actorInfo = actorInfos[i];
            if (!actorInfo.enable) {
                continue;
            }
            var snapActor = this.createFeatureSnapActor(actorInfo.geoLiveType, actorInfo.exceptions);
            snapActor.priority = actorInfo.priority;
            this.installSnapActor(snapActor);
        }

        // add by chenx on 2017-8-2
        // 增加图幅线捕捉
        var meshSnaper = new fastmap.mapApi.snap.MeshBorderSnapActor();
        meshSnaper.priority = -99; // 采用有无捕捉算法, 而且优先级最低
        this.installSnapActor(meshSnaper);
    },

    resetMouseInfo: function () {
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawSnapPoint();

        this.drawMouseNearestPoint();

        this.refreshFeedback();
    },

    drawFinalGeometry: function () {
        var ls = this.shapeEditor.editResult.finalGeometry;
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

        var sVertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_start_vertex');
        var eVertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_end_vertex');
        var vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

        for (var i = 0; i < ls.coordinates.length; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            var symbol = null;
            if (i === 0) {
                symbol = sVertexSymbol;
            } else if (i === ls.coordinates.length - 1) {
                symbol = eVertexSymbol;
            } else {
                symbol = vertexSymbol;
            }
            this.defaultFeedback.add(vertex, symbol);
        }
    },

    drawSnapPoint: function () {
        if (!this.shapeEditor.editResult.snapResults) {
            return;
        }

        var snapPointSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_snap_point');
        var snapLinkSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_snap_link');
        var symbol = null;

        var results = this.shapeEditor.editResult.snapResults;
        var keys = Object.getOwnPropertyNames(results);
        var snapObj,
            geomType;
        for (var i = 0; i < keys.length; ++i) {
            snapObj = results[keys[i]];
            // modified by chenx on 2017-8-3
            // 捕捉上的可能不是要素，例如图幅边
            if (snapObj.feature) {
                geomType = snapObj.feature.geometry.type;
                if (geomType === 'Point') {
                    symbol = snapPointSymbol;
                } else {
                    symbol = snapLinkSymbol;
                }
            } else {
                symbol = snapPointSymbol;
            }

            var point = snapObj.point;
            this.defaultFeedback.add(point, symbol);
        }
    },

    drawMouseNearestPoint: function () {
        if (!this.isDragging || !this.nearestPoint) {
            return;
        }

        var symbol = this.symbolFactory.getSymbol('shapeEdit_pt_selected_vertex');

        this.defaultFeedback.add(this.nearestPoint, symbol);
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        if (!this.isDragging) {
            return;
        }

        if (this.dashLine) {
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.dashLineFeedback.add(this.dashLine, lineSymbol);
        }

        this.refreshFeedback();
    },

    getDashLineByVertexIndex: function (index) {
        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var ls = this.shapeEditor.editResult.finalGeometry;

        var prevCoordinate = null;
        var nextCoordinate = null;
        var mouseCoordinate = null;

        if (index === 0) {
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        } else if (index === ls.coordinates.length - 1) {
            prevCoordinate = ls.coordinates[index - 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
        } else {
            prevCoordinate = ls.coordinates[index - 1];
            nextCoordinate = ls.coordinates[index + 1];
            mouseCoordinate = this.mousePoint.coordinates;
            dashLine.coordinates.push(prevCoordinate);
            dashLine.coordinates.push(mouseCoordinate);
            dashLine.coordinates.push(nextCoordinate);
        }

        return dashLine;
    },

    getDashLineByEdgeIndex: function (index) {
        var dashLine = {
            type: 'LineString',
            coordinates: []
        };

        var ls = this.shapeEditor.editResult.finalGeometry;

        var prevCoordinate = ls.coordinates[index];
        var nextCoordinate = ls.coordinates[index + 1];
        var mouseCoordinate = this.mousePoint.coordinates;
        dashLine.coordinates.push(prevCoordinate);
        dashLine.coordinates.push(mouseCoordinate);
        dashLine.coordinates.push(nextCoordinate);

        return dashLine;
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

    getNearestLocations: function (point) {
        if (!point) {
            return null;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        return this.geometryAlgorithm.nearestLocations(point, ls);
    },

    getPointByIndex: function (index, nearestLocations) {
        if (index === nearestLocations.previousIndex) {
            return nearestLocations.previousPoint;
        }
        if (index === nearestLocations.nextIndex) {
            return nearestLocations.nextPoint;
        }
        return null;
    },

    getSelectedVertexIndex: function (point) {
        if (!point) {
            return null;
        }

        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        var points = [];
        for (var i = 0; i < ls.coordinates.length; ++i) {
            var tmpPoint = this.coordinatesToPoint(ls.coordinates[i]);
            this.addPoint(tmpPoint, i, points);
        }

        var pixelPoint = this.lonlatToPixel(point);
        var selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        var dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    },

    getNearestVertexIndex: function (index, point) {
        var ls = this.shapeEditor.editResult.finalGeometry;
        if (!ls) {
            return null;
        }

        var points = [];
        var prevIndex = index - 1;
        var nextIndex = index + 1;

        if (prevIndex > 0) {
            var prevPoint = this.coordinatesToPoint(ls.coordinates[prevIndex]);
            this.addPoint(prevPoint, prevIndex, points);
        }

        if (nextIndex < ls.coordinates.length - 1) {
            var nextPoint = this.coordinatesToPoint(ls.coordinates[nextIndex]);
            this.addPoint(nextPoint, nextIndex, points);
        }

        var pixelPoint = this.lonlatToPixel(point);
        var selectedItem = this.findNearestPoint(pixelPoint, points);
        if (!selectedItem) {
            return null;
        }

        var dis = this.geometryAlgorithm.distance(pixelPoint, selectedItem.key);
        if (dis < this.threshold) {
            return selectedItem.value;
        }

        return null;
    },

    addPoint: function (point, value, points) {
        var pixelPoint = this.lonlatToPixel(point);
        points.push({
            key: pixelPoint,
            value: value
        });
    },

    findNearestPoint: function (point, points) {
        var selectedItem = null;
        var minDis = Number.MAX_VALUE;
        for (var i = 0; i < points.length; ++i) {
            var item = points[i];
            var tmpPoint = item.key;
            var dis = this.geometryAlgorithm.distance(point, tmpPoint);
            if (dis < minDis) {
                minDis = dis;
                selectedItem = item;
            }
        }

        return selectedItem;
    },

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
    },

    lonlatToPixel: function (point) {
        var pixelPoint = this.map.project([point.coordinates[1], point.coordinates[0]]);
        var newPoint = this.coordinatesToPoint([pixelPoint.x, pixelPoint.y]);
        return newPoint;
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
        var opereation = new fastmap.uikit.operation.PathVertexAddOperation(
            this.shapeEditor,
            index,
            point,
            snap
        );

        this.createOperation(opereation);
    },

    delVertex: function (index) {
        var opereation = new fastmap.uikit.operation.PathVertexRemoveOperation(
            this.shapeEditor,
            index,
            null,
            null
        );

        this.createOperation(opereation);
    },

    moveVertex: function (index, point, snap) {
        var opereation = new fastmap.uikit.operation.PathVertexMoveOperation(
            this.shapeEditor,
            index,
            point,
            snap
        );

        this.createOperation(opereation);
    }
});

