/**
 * Created by zhaohang on 2017/5/17.
 */

fastmap.uikit.relationEdit.TipMultiDigitizedTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'TipMultiDigitizedTool';
        this.snapActor = null;
        this.changeStartPoint = false;
        this.changeFinishPoint = false;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.changeStartPoint = false;
        this.changeFinishPoint = false;
        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
        this.changeStartPoint = false;
        this.changeFinishPoint = false;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        if (!this.editResult.startPointData || !this.editResult.finishPointData || this.changeStartPoint || this.changeFinishPoint) {
            this.installInLinkSnapActor();
            return;
        }
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        var actorInfos = this.editResult.snapActors;
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

    resetMouseInfo: function () {
        if (!this.editResult.startPointData || this.changeStartPoint) {
            this.setMouseInfo('请选择起点!');
            return;
        }
        if (!this.editResult.finishPointData || this.changeFinishPoint) {
            this.setMouseInfo('请选择终点!');
            return;
        }

        this.setMouseInfo('请按空格保存');
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        if (this.editResult.startPointData) {
            var inLinkGeometry = {
                type: 'LineString',
                coordinates: []
            };
            if (this.editResult.startPointData.linkData.type === 'tips') {
                inLinkGeometry.coordinates = this.editResult.startPointData.linkData.geometry.geometries[1].coordinates;
            } else {
                inLinkGeometry.coordinates = this.editResult.startPointData.linkData.geometry.coordinates;
            }
            var startLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(inLinkGeometry, startLinkSymbol);
            var startPointSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(this.editResult.startPointData.pointData, startPointSymbol);
        }

        if (this.editResult.finishPointData) {
            var endLinkGeometry = {
                type: 'LineString',
                coordinates: []
            };
            if (this.editResult.finishPointData.linkData.type === 'tips') {
                endLinkGeometry.coordinates = this.editResult.finishPointData.linkData.geometry.geometries[1].coordinates;
            } else {
                endLinkGeometry.coordinates = this.editResult.finishPointData.linkData.geometry.coordinates;
            }
            var finishLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(endLinkGeometry, finishLinkSymbol);
            var finishPointSymbol = this.symbolFactory.getSymbol('pt_poiLocation');
            this.defaultFeedback.add(this.editResult.finishPointData.pointData, finishPointSymbol);
        }

        this.refreshFeedback();
    },

    selectStartPoint: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var link = res.feature;
        var point = res.point;
        newEditResult.startPointData = {
            linkData: link,
            pointData: point
        };
        this.createOperation('起点信息', newEditResult);
    },

    selectFinishPoint: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var link = res.feature;
        var point = res.point;
        newEditResult.finishPointData = {
            linkData: link,
            pointData: point
        };
        this.createOperation('终点信息', newEditResult);
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        var newEditResult = FM.Util.clone(this.editResult);
        switch (key) {
            case 's':   // 修改起点
                this.changeStartPoint = true;
                this.changeFinishPoint = false;
                this.createOperation('修改起点位置', newEditResult);
                break;
            case 'e':   // 修改终点
                this.changeFinishPoint = true;
                this.changeStartPoint = false;
                this.createOperation('修改终点位置', newEditResult);
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

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (!this.editResult.startPointData || this.changeStartPoint) {
            this.selectStartPoint(res);
        } else if (!this.editResult.finishPointData || this.changeFinishPoint) {
            this.selectFinishPoint(res);
        }
        return true;
    }
});
