/**
 * Created by wuzhen on 2017/3/30.
 * 用于点位操作工具,比如行政区划代表点
 */
fastmap.uikit.shapeEdit.PointLocationTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
        this.snapActor = new fastmap.mapApi.snap.SnapActor();

        this.name = 'PointLocationTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);

        this.tempToolResult = FM.Util.clone(this.shapeEditor.editResult);
        if (this.shapeEditor.editResult.originObject) {
            this.shapeEditor.editResult.guide = null;
            this.shapeEditor.editResult.guideLink = null;
            this.shapeEditor.editResult.coordinate = null;
        }
        this.snapActor.setMap(this.map);
        // 当前启用的热键;
        this.currentHotKey = null;
        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);
        this.tempToolResult = null;
        this.currentHotKey = null;
        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);
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

    resetMouseInfo: function () {
        if (!this.shapeEditor.editResult.guide && !this.shapeEditor.editResult.coordinate) {
            this.setMouseInfo('移动设置坐标点和引导线');
        }
        if (!this.shapeEditor.editResult.guide && this.shapeEditor.editResult.coordinate) {
            this.setMouseInfo('移动鼠标设置引导线');
        }
        if (this.shapeEditor.editResult.guide && !this.shapeEditor.editResult.coordinate) {
            this.setMouseInfo('移动鼠标设置坐标点');
        }
        if (this.shapeEditor.editResult.guide && this.shapeEditor.editResult.coordinate) {
            this.setMouseInfo('可通过快捷键a/d/s调整或空格保存');
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        if (!this.tempToolResult.guide) {
            return;
        }
        // 捕捉引导线的十字光标；
        var snapCrossGeo = this.tempToolResult.guide;
        var linkSymbolGeo = {
            type: 'LineString',
            coordinates: [this.tempToolResult.guide.coordinates, this.tempToolResult.coordinate.coordinates]
        };
        var sSymbolGeo = this.tempToolResult.coordinate;
        var snapCross = this.symbolFactory.getSymbol('snap_pt_cross');
        var linkSymbol = this.symbolFactory.getSymbol('ls_guideLink');
        var cSymbol = this.symbolFactory.getSymbol('pt_adAdminLoc');
        if (this.shapeEditor.editResult.coordinate && !this.shapeEditor.editResult.guide) {
            sSymbolGeo = this.shapeEditor.editResult.coordinate;
            linkSymbolGeo = {
                type: 'LineString',
                coordinates: [this.tempToolResult.guide.coordinates, sSymbolGeo.coordinates]
            };
        }
        if (this.shapeEditor.editResult.guide && !this.shapeEditor.editResult.coordinate) {
            snapCrossGeo = this.shapeEditor.editResult.guide;
            sSymbolGeo = this.tempToolResult.coordinate;
            linkSymbolGeo = {
                type: 'LineString',
                coordinates: [snapCrossGeo.coordinates, sSymbolGeo.coordinates]
            };
        }
        if (this.shapeEditor.editResult.guide && this.shapeEditor.editResult.coordinate) {
            snapCrossGeo = this.shapeEditor.editResult.guide;
            sSymbolGeo = this.shapeEditor.editResult.coordinate;
            linkSymbolGeo = {
                type: 'LineString',
                coordinates: [snapCrossGeo.coordinates, sSymbolGeo.coordinates]
            };
        }
        this.defaultFeedback.add(snapCrossGeo, snapCross);
        this.defaultFeedback.add(linkSymbolGeo, linkSymbol);
        this.defaultFeedback.add(sSymbolGeo, cSymbol);

        // 编辑的时候高亮原来的;
        if (this.shapeEditor.editResult.originObject) { // 绘制原始高亮
            var poSymbol = this.symbolFactory.getSymbol('pt_poiGuide');
            this.defaultFeedback.add(this.shapeEditor.editResult.originObject.guidePoint, poSymbol);
            var goLinkSymbol = this.symbolFactory.getSymbol('ls_guideLink');
            this.defaultFeedback.add(this.shapeEditor.editResult.originObject.guideLink, goLinkSymbol);
            var coSymbol = this.symbolFactory.getSymbol('pt_adAdminLoc');
            this.defaultFeedback.add(this.shapeEditor.editResult.originObject.geometry, coSymbol);
        }

        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (this.shapeEditor.editResult.guide && this.shapeEditor.editResult.coordinate && !this.shapeEditor.editResult.originObject) {
            return false;
        }
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        // 鼠标移动过程计算与当前移动点最近的link;
        this.setCreatePoiInfo();
        this.resetFeedback();
        return true;
    },

    setCreatePoiInfo: function () {
        this.tempToolResult.coordinate = this.mousePoint;
        var features = this.featureSelector.selectByGeoLiveType('RDLINK');
        var minDistance;
        var fc = 0;
        for (var i = 0; i < features.length; i++) {
            // var temp = this.geometryAlgorithm.nearestPoints(features[i].geometry, this.mousePoint);
            var temp = this.snapActor.nearestPoints(features[i].geometry, this.mousePoint);
            if (i === 0) {
                minDistance = temp.distance;
                this.tempToolResult.guide = temp.point1;
                this.tempToolResult.guideLink = features[i];
                fc = parseInt(features[i].properties.fc, 10);
                continue;
            }
            if (minDistance > temp.distance) {
                minDistance = temp.distance;
                this.tempToolResult.guide = temp.point1;
                this.tempToolResult.guideLink = features[i];
                fc = parseInt(features[i].properties.fc, 10);
            } else if (minDistance === temp.distance) { // 当距离相同的时候根据fc进行的值进行选择  // fc的原则：1>2>3>4>5>0
                var tempFc = parseInt(features[i].properties.fc, 10);
                if (tempFc !== 0 && tempFc < fc) {
                    minDistance = temp.distance;
                    this.tempToolResult.guide = temp.point1;
                    this.tempToolResult.guideLink = features[i];
                    fc = tempFc;
                }
            }
        }
    },

    onKeyUp: function (event) {
        // 如果没有点击则不绑定快捷键;
        if (!this.shapeEditor.editResult.guide && !this.shapeEditor.editResult.coordinate) {
            return false;
        }
        // 记录当前激活的快捷键;
        this.currentHotKey = event.key;
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);

        switch (this.currentHotKey) {
            case 'a':
                newEditResult.coordinate = null;
                newEditResult.guide = null;
                newEditResult.guideLink = null;
                this.shapeEditor.createOperation('移动设置坐标点和引导线', newEditResult);
                break;
            case 'd':
                newEditResult.coordinate = this.shapeEditor.editResult.coordinate;
                newEditResult.guide = null;
                newEditResult.guideLink = null;
                this.shapeEditor.createOperation('移动鼠标设置引导线', newEditResult);
                break;
            case 's':
                newEditResult.coordinate = null;
                newEditResult.guide = this.shapeEditor.editResult.guide;
                newEditResult.guideLink = this.shapeEditor.editResult.guideLink;
                this.shapeEditor.createOperation('移动鼠标设置坐标点', newEditResult);
                break;
            default:
                break;
        }

        return true;
    },

    onLeftButtonClick: function (event) {
        // 如果一定点到一个位置则不监听鼠标点击事件;
        if (this.shapeEditor.editResult.guide && this.shapeEditor.editResult.coordinate) {
            return false;
        }

        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }


        var newEditResult = FM.Util.clone(this.tempToolResult);
        var point = this.latlngToPoint(event.latlng);
        // this.tempToolResult.coordinate = point;

        // 修改引导线，代表点坐标不变，变的是捕捉的线和捕捉点；
        if (this.shapeEditor.editResult.coordinate) {
            newEditResult.coordinate = this.shapeEditor.editResult.coordinate;
        }
        // 修改代表点位置，捕捉的线和捕捉点不变，变得是代表点的位置;
        if (this.shapeEditor.editResult.guide) {
            newEditResult.guideLink = this.shapeEditor.editResult.guideLink;
            newEditResult.guide = this.shapeEditor.editResult.guide;
        }

        this.shapeEditor.createOperation('点击确认修改', newEditResult);

        return true;
    }
});
