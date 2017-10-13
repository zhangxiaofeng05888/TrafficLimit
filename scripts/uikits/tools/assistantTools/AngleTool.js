/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.assistantTool.AngleTool = fastmap.uikit.assistantTool.AssistantTool.extend({
    initialize: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'AngleTool';
        this.dashLineFeedback = null;
        this.dashLine = null;
        this.arc = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.assistantTool.AssistantTool.prototype.startup.apply(this, arguments);

        this.dashLineFeedback = new fastmap.mapApi.Feedback();
        this.dashLineFeedback.priority = 0;
        this.defaultFeedback.priority = 1;
        this.installFeedback(this.dashLineFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.assistantTool.AssistantTool.prototype.resetStatus.apply(this, arguments);

        this.dashLineFeedback = null;
        this.dashLine = null;
        this.arc = null;
    },

    refresh: function () {
        this.arc = this.resetArc();
        this.dashLine = this.resetDashLine();
        this.resetFeedback();
        this.resetDashLineFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('');

        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length === 0) {
            this.setMouseInfo('单击鼠标左键开始测量角度');
            return;
        }
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        this.drawFinalGeometry();

        this.drawFinalGeometryVertex();

        this.drawLengthText();

        this.refreshFeedback();
    },

    drawFinalGeometry: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('distance_tool_ls_edge');
        this.defaultFeedback.add(ls, lineSymbol);
    },

    drawFinalGeometryVertex: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        var vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        for (var i = 0; i < ls.coordinates.length; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            this.defaultFeedback.add(vertex, vertexSymbol);
        }
    },

    drawLengthText: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        for (var i = 0; i < ls.coordinates.length - 1; ++i) {
            var vertex = this.coordinatesToPoint(ls.coordinates[i]);
            var nextVertex = this.coordinatesToPoint(ls.coordinates[i + 1]);
            var length = this.geometryAlgorithm.sphericalDistance(vertex, nextVertex);
            var symbol = FM.Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
            symbol.text = length.toFixed(2) + '米';
            this.setTextSymbolOffset(symbol);
            this.defaultFeedback.add(nextVertex, symbol);
        }
    },

    resetDashLineFeedback: function () {
        if (!this.dashLineFeedback) {
            return;
        }

        this.dashLineFeedback.clear();
        this.refreshFeedback();

        var ls = this.editResult.finalGeometry;
        if (!ls) {
            return;
        }

        this.drawDashLine();

        this.drawTmpDashLine();

        this.drawMousePoint();

        this.drawArc();

        this.drawAngle();

        this.refreshFeedback();
    },

    drawDashLine: function () {
        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        var length = this.geometryAlgorithm.sphericalLength(this.dashLine);

        if (length === 0) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        var textSymbol = FM.Util.clone(this.symbolFactory.getSymbol('distance_tool_pt_length_text'));
        textSymbol.text = length.toFixed(2) + '米';
        this.setTextSymbolOffset(textSymbol);
        this.dashLineFeedback.add(this.dashLine, lineSymbol);
        this.dashLineFeedback.add(this.mousePoint, textSymbol);
    },

    drawTmpDashLine: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return;
        }

        if (!this.arc || this.arc.coordinates.length < 2) {
            return;
        }

        var start = this.coordinatesToPoint(ls.coordinates[0]);
        var center = this.coordinatesToPoint(ls.coordinates[1]);
        var end = null;
        if (ls.coordinates.length === 2) {
            end = this.mousePoint;
        } else {
            end = this.coordinatesToPoint(ls.coordinates[2]);
        }

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);

        var pixelStart = this.geojsonTransform.convertGeometry(start);
        var pixelEnd = this.geojsonTransform.convertGeometry(end);
        var pixelCenter = this.geojsonTransform.convertGeometry(center);

        var gStert = this.geometryFactory.fromGeojson(pixelStart);
        var gEnd = this.geometryFactory.fromGeojson(pixelEnd);
        var gCenter = this.geometryFactory.fromGeojson(pixelCenter);

        var vS = gStert.minus(gCenter);
        var vE = gEnd.minus(gCenter);

        var sLength = vS.length();
        var eLength = vE.length();

        vS.normalize();
        vE.normalize();

        var gPoint1 = null;
        var gPoint2 = null;
        if (sLength > eLength) {
            gPoint1 = gEnd;
            gPoint2 = gCenter.plusVector(vE.multiNumber(sLength));
        } else {
            gPoint1 = gStert;
            gPoint2 = gCenter.plusVector(vS.multiNumber(eLength));
        }

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);

        var point1 = this.geometryFactory.toGeojson(gPoint1);
        var point2 = this.geometryFactory.toGeojson(gPoint2);
        point1 = this.geojsonTransform.convertGeometry(point1);
        point2 = this.geojsonTransform.convertGeometry(point2);

        var geometry = {
            type: 'LineString',
            coordinates: [point1.coordinates, point2.coordinates]
        };

        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        this.dashLineFeedback.add(geometry, lineSymbol);
    },

    drawMousePoint: function () {
        if (!this.dashLine || this.dashLine.coordinates.length < 2) {
            return;
        }

        if (!this.mousePoint) {
            return;
        }

        var vertexSymbol = this.symbolFactory.getSymbol('distance_tool_pt_vertex');

        this.dashLineFeedback.add(this.mousePoint, vertexSymbol);
    },

    drawArc: function () {
        if (!this.arc || this.arc.coordinates.length < 2) {
            return;
        }

        var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
        this.dashLineFeedback.add(this.arc, lineSymbol);
    },

    drawAngle: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return;
        }

        var center = this.coordinatesToPoint(ls.coordinates[1]);
        var start = this.coordinatesToPoint(ls.coordinates[0]);
        var end = null;
        if (ls.coordinates.length === 2) {
            end = this.mousePoint;
        } else {
            end = this.coordinatesToPoint(ls.coordinates[2]);
        }

        if (this.geometryAlgorithm.equals(center, start)) {
            return;
        }

        if (this.geometryAlgorithm.equals(center, end)) {
            return;
        }

        var angle = this.getAngle(start, end, center);
        var symbol = FM.Util.clone(this.symbolFactory.getSymbol('angle_tool_pt_angle_text'));
        symbol.text = angle.toFixed(2) + '°';
        this.setAngleSymbolOffset(symbol);
        this.dashLineFeedback.add(center, symbol);
    },

    setTextSymbolOffset: function (symbol) {
        var size = symbol.getOriginBound().getSize();
        symbol.offsetX = size.width / 2;
        symbol.offsetY = -size.height;
    },

    setAngleSymbolOffset: function (symbol) {
        var size = symbol.getOriginBound().getSize();
        symbol.offsetX = size.width / 2;
        symbol.offsetY = size.height;
    },

    resetDashLine: function () {
        var dashLine = {
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

        var lastCoordinate = ls.coordinates[ls.coordinates.length - 1];
        dashLine.coordinates.push(lastCoordinate);
        dashLine.coordinates.push(this.mousePoint.coordinates);
        return dashLine;
    },

    resetArc: function () {
        var ls = this.editResult.finalGeometry;
        if (!ls || ls.coordinates.length < 2) {
            return null;
        }

        if (!this.mousePoint) {
            return null;
        }

        var center = null;
        var start = null;
        var end = null;
        if (ls.coordinates.length === 2) {
            start = this.coordinatesToPoint(ls.coordinates[0]);
            end = this.mousePoint;
            center = this.coordinatesToPoint(ls.coordinates[1]);
            if (this.geometryAlgorithm.equals(start, center) ||
                this.geometryAlgorithm.equals(end, center)) {
                return null;
            }
            return this.getArcGeometry(start, end, center);
        }

        if (ls.coordinates.length === 3) {
            start = this.coordinatesToPoint(ls.coordinates[0]);
            end = this.coordinatesToPoint(ls.coordinates[2]);
            center = this.coordinatesToPoint(ls.coordinates[1]);

            if (this.geometryAlgorithm.equals(start, center) ||
                this.geometryAlgorithm.equals(end, center)) {
                return null;
            }

            return this.getArcGeometry(start, end, center);
        }

        return null;
    },

    getArcGeometry: function (start, end, center) {
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);

        var pixelStart = this.geojsonTransform.convertGeometry(start);
        var pixelEnd = this.geojsonTransform.convertGeometry(end);
        var pixelCenter = this.geojsonTransform.convertGeometry(center);

        var radiusStart = this.geometryAlgorithm.distance(pixelStart, pixelCenter);
        var radiusEnd = this.geometryAlgorithm.distance(pixelEnd, pixelCenter);
        var radius = radiusStart > radiusEnd ? radiusStart : radiusEnd;

        var vY = new fastmap.mapApi.symbol.Vector(0, -1);
        var vS = this.geometryFactory.fromGeojson(pixelStart).minus(this.geometryFactory.fromGeojson(pixelCenter));
        var vE = this.geometryFactory.fromGeojson(pixelEnd).minus(this.geometryFactory.fromGeojson(pixelCenter));

        var sAngle = vY.angleTo(vS);
        var eAngle = vY.angleTo(vE);
        var sSigned = vY.cross(vS);
        var eSigned = vY.cross(vE);
        if (sSigned < 0) {
            sAngle = -sAngle;
        }
        if (eSigned < 0) {
            eAngle = -eAngle;
        }

        var startAngle = null;
        var endAngle = null;
        var angle = vS.angleTo(vE);
        var signed = vS.cross(vE);
        if (signed < 0) {
            startAngle = eAngle;
        } else {
            startAngle = sAngle;
        }
        endAngle = startAngle + angle;

        var x = pixelCenter.coordinates[0];
        var y = pixelCenter.coordinates[1];

        var arc = this.geometryAlgorithm.arc(x, y, radius, startAngle, endAngle, 2);

        this.geojsonTransform.setEnviroment(this.map, null, this.convertToGeography);

        arc = this.geojsonTransform.convertGeometry(arc);

        return arc;
    },

    getAngle: function (start, end, center) {
        this.geojsonTransform.setEnviroment(this.map, null, this.convertToPixel);

        var pixelStart = this.geojsonTransform.convertGeometry(start);
        var pixelEnd = this.geojsonTransform.convertGeometry(end);
        var pixelCenter = this.geojsonTransform.convertGeometry(center);

        var vS = this.geometryFactory.fromGeojson(pixelStart).minus(this.geometryFactory.fromGeojson(pixelCenter));
        var vE = this.geometryFactory.fromGeojson(pixelEnd).minus(this.geometryFactory.fromGeojson(pixelCenter));

        var angle = vS.angleTo(vE);

        return angle;
    },

    getNearestEndPoint: function (point, ls) {
        var start = this.coordinatesToPoint(ls.coordinates[0]);
        var end = this.coordinatesToPoint(ls.coordinates[ls.coordinates.length - 1]);

        var sDis = this.geometryAlgorithm.sphericalDistance(start, point);
        var eDis = this.geometryAlgorithm.sphericalDistance(end, point);

        if (sDis < eDis) {
            return start;
        }
        return end;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.assistantTool.AssistantTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.arc = this.resetArc();
        this.dashLine = this.resetDashLine();
        this.resetDashLineFeedback();

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.assistantTool.AssistantTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.onAddVertex();

        return true;
    },

    onAddVertex: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        if (newEditResult.finalGeometry.coordinates.length === 3) {
            newEditResult = this.getEmptyEditResult();
        }
        newEditResult.finalGeometry.coordinates.push(this.mousePoint.coordinates);
        if (newEditResult.finalGeometry.coordinates.length === 3) {
            newEditResult.isFinish = true;
            this.createOperation('添加形状点', newEditResult);
        } else {
            this.createOperation('添加形状点', newEditResult);
        }
    }
});
