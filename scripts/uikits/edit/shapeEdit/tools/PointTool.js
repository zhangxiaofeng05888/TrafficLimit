/**
 * Created by zhaohang on 2017/4/24.
 */

fastmap.uikit.shapeEdit.PointTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();

        this.name = 'PointTool';
        this.changeLinks = false;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);
        this.changeLinks = false;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetMouseInfo();
        this.resetSnapActor();
    },

    resetMouseInfo: function () {
        if (!this.shapeEditor.editResult.editing) {
            if (this.shapeEditor.editResult.geoLiveType === 'TIPTRAFFICSIGNAL') {
                this.setMouseInfo('请在地图上戳点，更新Tips');
            } else {
                this.setMouseInfo('请在地图上戳点，新增Tips');
            }

            return;
        }
        if (this.shapeEditor.editResult.geoLiveType === 'TIPTRAFFICSIGNAL') {
            this.setMouseInfo('按c选取不受控link，或者按空格保存！');
            return;
        }
        this.setMouseInfo('请按空格保存!');
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        if (this.shapeEditor.editResult.geoLiveType === 'TIPTRAFFICSIGNAL' && this.changeLinks) {
            this.installInLinkSnapActor();
            return;
        }
    },

    installInLinkSnapActor: function () {
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

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.shapeEditor.editResult.coordinate) {
            var coordinateSymbol = this.symbolFactory.getSymbol('pt_poiCreateLoc');
            this.defaultFeedback.add(this.shapeEditor.editResult.coordinate, coordinateSymbol);
        }

        if (this.shapeEditor.editResult.originObject) {
            var obj = this.shapeEditor.editResult.originObject;
            var locSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(obj.geometry.g_location, locSymbol);
        }

        var linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
        for (var i = 0; i < this.shapeEditor.editResult.links.length; i++) {
            if (this.shapeEditor.editResult.links[i].linkData.type === 'tips') {
                this.defaultFeedback.add(this.shapeEditor.editResult.links[i].linkData.geometry.geometries[1], linkSymbol);
            } else {
                this.defaultFeedback.add(this.shapeEditor.editResult.links[i].linkData.geometry, linkSymbol);
            }
        }
        this.refreshFeedback();
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        switch (key) {
            case 'c':   // 选择不受控link
                this.changeLinks = true;
                this.shapeEditor.createOperation('选择不受控link', newEditResult);
                break;
            default:
                break;
        }

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (this.changeLinks) {
            var mousePoint = this.latlngToPoint(event.latlng);
            this.snapController.snap(mousePoint);
            return true;
        }
        if (this.shapeEditor.editResult.editing) {
            return false;
        }
        this.setCreateTipsInfo(); // 显示坐标和引导坐标同时移动
        this.resetFeedback();
        return true;
    },

    setCreateTipsInfo: function () {
        this.shapeEditor.editResult.coordinate = this.mousePoint;
    },

    selectLinks: function (res) {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        var link = res.feature;
        var linkFlag = false;
        for (var i = 0; i < newEditResult.links.length; i++) {
            if (newEditResult.links[i].linkData.properties.id === link.properties.id) {
                newEditResult.links.splice(i, 1);
                linkFlag = true;
                break;
            }
        }
        if (!linkFlag) {
            newEditResult.links.push({
                linkData: res.feature,
                pointData: res.point
            });
        }
        this.shapeEditor.createOperation('选择非受控link', newEditResult);
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        if (this.changeLinks) {
            var mousePoint = this.latlngToPoint(event.latlng);
            var res = this.snapController.snap(mousePoint);
            if (!res) {
                return true;
            }
            this.selectLinks(res);
        } else {
            var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
            newEditResult.editing = true;
            this.shapeEditor.createOperation('设置tip点位', newEditResult);
        }

        return true;
    }
});
