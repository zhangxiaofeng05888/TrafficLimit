/**
 * Created by wuzhen on 2017/3/27.
 * 修改坐标，引导坐标，引导link
 */
fastmap.uikit.shapeEdit.PoiUpdateTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
        this.snapActor = new fastmap.mapApi.snap.SnapActor();

        this.name = 'PoiUpdateTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);
        this.snapActor.setMap(this.map);

        this.refresh();
        this.eventController.on(L.Mixin.EventTypes.POIMOVEABLERES, this.movePoiAndRawFields);
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
        this.eventController.off(L.Mixin.EventTypes.POIMOVEABLERES);
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);
    },

    refresh: function () {
        this.resetFeedback();
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.shapeEditor.editResult.coordinate && this.shapeEditor.editResult.guide) {
            var poiSymbol = this.symbolFactory.getSymbol('snap_pt_cross');
            this.defaultFeedback.add(this.shapeEditor.editResult.guide, poiSymbol);
            var coordinateSymbol = this.symbolFactory.getSymbol('pt_poiCreateLoc');
            this.defaultFeedback.add(this.shapeEditor.editResult.coordinate, coordinateSymbol);
            var guideSymbol = this.symbolFactory.getSymbol('pt_poiGuide');
            this.defaultFeedback.add(this.shapeEditor.editResult.coordinate, guideSymbol);
            var guigeLinkSymbol = this.symbolFactory.getSymbol('ls_guideLink_blue');
            this.defaultFeedback.add({
                type: 'LineString',
                coordinates: [this.shapeEditor.editResult.guide.coordinates, this.shapeEditor.editResult.coordinate.coordinates]
            }, guigeLinkSymbol);
        }

        if (this.shapeEditor.editResult.originObject) {
            var obj = this.shapeEditor.editResult.originObject;
            var locSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(obj.geometry, locSymbol);
            var gSymbol = this.symbolFactory.getSymbol('pt_poiGuide');
            this.defaultFeedback.add(obj.guide, gSymbol);
            var glSymbol = this.symbolFactory.getSymbol('ls_guideLink');
            this.defaultFeedback.add({
                type: 'LineString',
                coordinates: [obj.guide.coordinates, obj.geometry.coordinates]
            }, glSymbol);
        }

        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        // if (this.shapeEditor.editResult.editing) {
        //     return false;
        // }
        if (event.originalEvent.ctrlKey) { // 移动显示坐标
            this.setMouseInfo('移动显示坐标');
        } else if (event.originalEvent.shiftKey) { // 移动引导坐标
            this.setMouseInfo('移动引导坐标');
        } else {
            this.setMouseInfo('按住ctrl键移动显示坐标，按住shift键移动引导坐标，默认同时移动');
        }
        this.resetFeedback();
        return true;
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }
        // if (this.shapeEditor.editResult.editing) {
        //     return false;
        // }
        if (event.originalEvent.ctrlKey) { // 移动显示坐标
            this.setPointLocation();
        } else if (event.originalEvent.shiftKey) { // 移动引导坐标
            this.setGuide();
        } else {
            this.setMouseInfo('引导坐标随着显示坐标变化');
            this.setCreatePoiInfo(); // 显示坐标和引导坐标同时移动
        }
        this.resetFeedback();
        return true;
    },

    setPointLocation: function () {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        newEditResult.coordinate = this.mousePoint;
        this.shapeEditor.createOperation('设置显示坐标', newEditResult);
    },

    setGuide: function () {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        var temp = this.getGuideAndLink();
        newEditResult.tipOrLinkFlag = temp.tipOrLinkFlag;
        newEditResult.guide = temp.guide;
        newEditResult.guideLink = temp.guideLink;
        this.shapeEditor.createOperation('设置引导坐标', newEditResult);
    },

    setCreatePoiInfo: function () {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        newEditResult.coordinate = this.mousePoint;
        var temp = this.getGuideAndLink();
        newEditResult.tipOrLinkFlag = temp.tipOrLinkFlag;
        newEditResult.guide = temp.guide;
        newEditResult.guideLink = temp.guideLink;
        this.shapeEditor.createOperation('设置显示坐标和引导坐标', newEditResult);
    },

    getGuideAndLink: function () {
        var guideAndLink = {
            tipOrLinkFlag: 0, // 1表示link, 2表示tips
            guide: null,
            guideLink: null
        };
        var minDistance = Number.MAX_VALUE;
        var fc = 0;
        var features = this.featureSelector.selectByGeoLiveType('RDLINK');
        for (var i = 0; i < features.length; i++) {
            if (features[i].geometry.coordinates.length <= 1) { // 排除掉错误数据
                continue;
            }
            // var temp = this.geometryAlgorithm.nearestPoints(features[i].geometry, this.mousePoint);
            var temp = this.snapActor.nearestPoints(features[i].geometry, this.mousePoint);
            if (minDistance > temp.distance) {
                minDistance = temp.distance;
                guideAndLink.tipOrLinkFlag = 1;
                guideAndLink.guide = temp.point1;
                guideAndLink.guideLink = features[i];
                fc = parseInt(features[i].properties.fc, 10);
            } else if (minDistance === temp.distance) { // 当距离相同的时候根据fc进行的值进行选择  // fc的原则：1>2>3>4>5>0
                var tempFc = parseInt(features[i].properties.fc, 10);
                if (tempFc !== 0 && tempFc < fc) {
                    fc = tempFc;
                    guideAndLink.tipOrLinkFlag = 1;
                    guideAndLink.guide = temp.point1;
                    guideAndLink.guideLink = features[i];
                }
            }
        }
        
        var linksFeatures = this.featureSelector.selectByGeoLiveType('TIPLINKS'); // 测线
        for (i = 0; i < linksFeatures.length; i++) {
            var fea = linksFeatures[i];
            if (fea.properties.state === 0) { // 非删除的测线
                temp = this.snapActor.nearestPoints(fea.geometry, this.mousePoint);
                if (minDistance > temp.distance) {
                    minDistance = temp.distance;
                    guideAndLink.tipOrLinkFlag = 2;
                    guideAndLink.guide = temp.point1;
                    guideAndLink.guideLink = fea;
                }
            }
        }

        return guideAndLink;
    },

    calculateDistance: function (editorResult, origEditorResult) {
        var dis = this.geometryAlgorithm.sphericalDistance(editorResult.coordinate, origEditorResult.coordinate);
        return dis;
    },

    /**
     * 用data.rawFields替换掉rawFields中的8,9,10
     * 与道路逻辑关系调整-8 、 与设施逻辑关系调整-9 、 精度调整-10
     * @param data
     */
    movePoiAndRawFields: function (data) {
        var rf = data.rawFields;
        var rfArr = this.shapeEditor.editResult.rawFields;
        var arr = FM.Util.difference(rfArr, ['8', '9', '10']);
        arr.push(rf);
        this.shapeEditor.editResult.rawFields = arr;
        if (this.onFinish) {
            this.onFinish(null);
        }
    },

    onKeyUp: function (event) {
        var key = event.key;
        switch (key) {
            case 'Escape':
                var options = this.shapeEditor.originEditResult;
                var checkController = this.shapeEditor.originEditResult.checkController;
                options.checkController = null;
                var newEditResult = FM.Util.clone(options);
                newEditResult.checkController = checkController;
                options.checkController = checkController;
                this.shapeEditor.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
                if (this.onFinish) {
                    // 屏蔽无效点位功能
                    var distace = this.calculateDistance(this.shapeEditor.editResult, this.shapeEditor.originEditResult);
                    var state = this.shapeEditor.editResult.originObject.state;
                    if (state == 3 && distace != 0 && distace <= 15) { // 状态为修改且 显示坐标有移动并且距离小于等于15米时进行无效位移提醒
                        this.eventController.fire(L.Mixin.EventTypes.POIMOVEABLEREQ, {
                            distance: distace.toFixed(2)
                        });
                    } else {
                        this.onFinish(null);
                    }
                }
                break;
            case 'z':
                if (event.ctrlKey) {
                    this.operationController.undo();
                }
                break;
            case 'x':
                if (event.ctrlKey) {
                    this.operationController.redo();
                }
                break;
            default:
                break;
        }

        return true;
    }
});
