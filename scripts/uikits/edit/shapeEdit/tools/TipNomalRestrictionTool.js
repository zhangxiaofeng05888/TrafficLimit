/**
 * Created by zhaohang on 2017/6/7.
 */
/**
 * Created by zhaohang on 2017/4/25.
 */

fastmap.uikit.shapeEdit.TipNomalRestrictionTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();

        this.name = 'TipNomalRestrictionTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);
        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
        this.eventController.on(L.Mixin.EventTypes.TIPNORMALRESTRICTIONSPACE, this.enterSpace);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);
        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED);
        this.eventController.off(L.Mixin.EventTypes.TIPNORMALRESTRICTIONSPACE);
        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);
    },

    refresh: function () {
        this.resetFeedback();
        this.resetMouseInfo();
        this.resetSnapActor();
        if (!this.shapeEditor.editResult.originObject) {
            this.resetPanel();
        }
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
            this.setMouseInfo('请在地图上戳点，新增Tips');
            return;
        }
        this.setMouseInfo('请按空格保存!');
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
            var inLinkGeometry = {
                type: 'LineString',
                coordinates: []
            };
            if (this.shapeEditor.editResult.guideLink.type === 'tips') {
                inLinkGeometry.coordinates = this.shapeEditor.editResult.guideLink.geometry.geometries[1].coordinates;
            } else {
                inLinkGeometry.coordinates = this.shapeEditor.editResult.guideLink.geometry.coordinates;
            }
            var linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(inLinkGeometry, linkSymbol);
        }

        if (this.shapeEditor.editResult.originObject) {
            var obj = this.shapeEditor.editResult.originObject;
            var locSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(obj.geometry.g_location, locSymbol);
            var gSymbol = this.symbolFactory.getSymbol('pt_poiGuide');
            this.defaultFeedback.add(obj.geometry.g_guide, gSymbol);
            var glSymbol = this.symbolFactory.getSymbol('ls_guideLink');
            this.defaultFeedback.add({
                type: 'LineString',
                coordinates: [obj.geometry.g_guide.coordinates, obj.geometry.g_location.coordinates]
            }, glSymbol);
        }

        this.refreshFeedback();
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        this.installLinkSnapActor();
    },

    installLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        var actorInfos = this.shapeEditor.editResult.snapActors;
        for (var i = 0; i < actorInfos.length; ++i) {
            var actorInfo = actorInfos[i];
            if (!actorInfo.enable) {
                continue;
            }
            var snapActor = this.createFullScreenFeatureSnapActor(actorInfo.geoLiveType, actorInfo.exceptions);
            snapActor.priority = actorInfo.priority;
            this.installSnapActor(snapActor);
        }
    },
    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);
        if (this.shapeEditor.editResult.editing) {
            return false;
        }
        if (event.originalEvent.ctrlKey) { // 移动显示坐标
            this.setMouseInfo('移动显示坐标');
            this.setPointLocation();
        } else if (event.originalEvent.shiftKey) { // 移动引导坐标
            this.setMouseInfo('移动引导坐标');
            this.setGuide();
        } else {
            this.setMouseInfo('引导坐标随着显示坐标变化');
            this.setCreateTipsInfo(); // 显示坐标和引导坐标同时移动
        }
        this.resetFeedback();
        return true;
    },

    setPointLocation: function () {
        this.uninstallSnapActor(this.snapActor);
        var originObj = FM.Util.clone(this.shapeEditor.editResult.originObject);
        this.shapeEditor.editResult.coordinate = this.mousePoint;
        this.shapeEditor.editResult.guide = originObj.geometry.g_guide;
    },

    setGuide: function () {
        var res = this.snapController.snap(this.mousePoint);
        var originObject = FM.Util.clone(this.shapeEditor.editResult.originObject);
        this.shapeEditor.editResult.coordinate = originObject.geometry.g_location;
        this.shapeEditor.editResult.guide = res.point;
        this.shapeEditor.editResult.guideLink = res.feature;
    },

    setCreateTipsInfo: function () {
        var res = this.snapController.snap(this.mousePoint);
        this.shapeEditor.editResult.coordinate = this.mousePoint;
        this.shapeEditor.editResult.guide = res.point;
        this.shapeEditor.editResult.guideLink = res.feature;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        newEditResult.editing = true;

        this.shapeEditor.createOperation('设置tip点位', newEditResult);

        return true;
    },

    closeCreatePoiPanel: function () {
        var options = {
            panelName: 'TipNomalRestriction'
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, options); // 关闭浮动面板
    },

    openCreatePoiPanel: function () {
        var options = {
            panelName: 'TipNomalRestriction',
            data: {
                directData: this.shapeEditor.editResult.directData
            }
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options); // 打开右面浮动面板
        this.eventController.fire(L.Mixin.EventTypes.PARTSREFRESH, options); // 右面面板赋默认值
    },

    onPartsSelectedChanged: function (obj) {
        this.shapeEditor.editResult.directData = obj.directData;
    },

    enterSpace: function () {
        this.onFinish(null);
    }
});
