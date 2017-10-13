/**
 * Created by wuzhen on 2017/3/27.
 * 新增poi工具 -- 只适用于poi
 * 本工具在捕捉线的时候有对线fc属性的专有控制
 */
fastmap.uikit.shapeEdit.PoiAddTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
        this.snapActor = new fastmap.mapApi.snap.SnapActor();

        this.name = 'PoiAddTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);
        this.snapActor.setMap(this.map);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);
    },

    refresh: function () {
        this.resetFeedback();
        this.resetMouseInfo();
        this.resetPanel();
    },

    resetPanel: function () {
        if (this.shapeEditor.editResult.editing) {
            this.openCreatePoiPanel();
        } else {
            this.closeCreatePoiPanel();
        }
    },

    resetMouseInfo: function () {
        if (!this.shapeEditor.editResult.editing) {
            this.setMouseInfo('请在地图上戳点，新增POI，空格保存');
            return;
        }
        this.setMouseInfo('');
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
            var guigeLinkSymbol = this.symbolFactory.getSymbol('ls_guideLink');
            this.defaultFeedback.add({
                type: 'LineString',
                coordinates: [this.shapeEditor.editResult.guide.coordinates, this.shapeEditor.editResult.coordinate.coordinates]
            }, guigeLinkSymbol);
        }

        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        if (this.shapeEditor.editResult.editing) {
            return false;
        }
        this.setCreatePoiInfo();
        this.resetFeedback();
        return true;
    },

    setCreatePoiInfo: function () {
        var guideAndLink = {
            tipOrLinkFlag: 0, // 1表示link, 2表示tips
            guide: null,
            guideLink: null
        };
        this.shapeEditor.editResult.coordinate = this.mousePoint;
        var features = this.featureSelector.selectByGeoLiveType('RDLINK');

        var minDistance = Number.MAX_VALUE;
        var fc = 0;
        for (var i = 0; i < features.length; i++) {
            if (features[i].geometry.coordinates.length <= 1) { // 排除掉错误数据
                continue;
            }
            // var temp = this.geometryAlgorithm.nearestPoints(features[i].geometry, this.mousePoint); // 没有经过投影转换，点位有偏差
            var temp = this.snapActor.nearestPoints(features[i].geometry, this.mousePoint);
            if (minDistance > temp.distance) {
                minDistance = temp.distance;
                guideAndLink.tipOrLinkFlag = 1;
                guideAndLink.guide = temp.point1;
                guideAndLink.guideLink = features[i];
                this.shapeEditor.editResult.guide = temp.point1;
                this.shapeEditor.editResult.guideLink = features[i];
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

        this.shapeEditor.editResult.tipOrLinkFlag = guideAndLink.tipOrLinkFlag;
        this.shapeEditor.editResult.guide = guideAndLink.guide;
        this.shapeEditor.editResult.guideLink = guideAndLink.guideLink;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        newEditResult.editing = true;

        this.shapeEditor.createOperation('设置poi点位', newEditResult);

        return true;
    },

    closeCreatePoiPanel: function () {
        var options = {
            panelName: 'createPoiPanel'
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, options); // 关闭浮动面板
    },

    openCreatePoiPanel: function () {
        var options = {
            panelName: 'createPoiPanel',
            data: {
                name: this.shapeEditor.editResult.name,
                kindCode: this.shapeEditor.editResult.kindCode ? this.shapeEditor.editResult.kindCode : 0
            }
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options); // 打开右面浮动面板
        this.eventController.fire(L.Mixin.EventTypes.PARTSREFRESH, options); // 右面面板赋默认值
        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED);
        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
    },

    onPartsSelectedChanged: function (obj) {
        this.shapeEditor.editResult.name = obj.name;
        this.shapeEditor.editResult.kindCode = obj.kindCode;
    }
});
