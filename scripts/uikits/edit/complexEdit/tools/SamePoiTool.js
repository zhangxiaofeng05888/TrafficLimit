/**
 * Created by wuzhen on 2016/3/30
 */

fastmap.uikit.complexEdit.SamePoiTool = fastmap.uikit.complexEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.transform = new fastmap.mapApi.MecatorTranform();

        this.eventController = fastmap.uikit.EventController();
        this.name = 'SamePoiTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = ['IXPOI'];
        this.selectedFeatures = [];

        this.refresh();
    },

    onRedo: function (oldEditResult, newEditResult) {

    },

    onUndo: function (oldEditResult, newEditResult) {

    },

    refresh: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.refresh.apply(this, arguments);

        this.resetPoiFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        this.setMouseInfo('请在地图上框选');
    },

    resetPoiFeedback: function () {
        if (this.editResult.originObject) {
            var obj = this.editResult.originObject;
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

    afterSelected: function () {
        var data = this.filterData();
        if (data && data.length > 0) {
            this.openCreatePoiPanel(data);
        } else {
            this.setCenterError('没有框选到符合条件的数据', 2000);
        }
    },

    filterData: function () {
        var returnData = [];
        var data = this.selectedFeatures;
        var origData = this.editResult.originObject;
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].properties.id === origData.pid) {
                continue;
            }
            var actualDistance = this.transform.distance(data[i].geometry.coordinates[1], data[i].geometry.coordinates[0], origData.geometry.coordinates[1], origData.geometry.coordinates[0]);
            if (actualDistance > 5) {
                // swal('提示', '组成同一关系的POI距离不能大于5米', 'info');
                continue;
            }
            returnData.push(data[i]);
        }
        return returnData;
    },

    openCreatePoiPanel: function (data) {
        var options = {
            panelName: 'samePoiPanel',
            data: data
        };
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options); // 打开右面浮动面板
        this.eventController.fire(L.Mixin.EventTypes.PARTSREFRESH, options); // 右面面板赋默认值
        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED);
        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
    },

    onPartsSelectedChanged: function (obj) {
        this.editResult.samePids = obj.samePids;

        if (this.onFinish) {
            this.onFinish(this.editResult);
        }
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                var newEditResult = FM.Util.clone(this.options.editResult);
                this.createOperation('恢复初始状态', newEditResult);
                break;
            case ' ':
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
