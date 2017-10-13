/**
 * Created by zhaohang on 2017/4/12.
 */

fastmap.uikit.editControl.ModifyRelationTipsControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.options = options;
        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTipsTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getModifyEditResult(this.options);
        this.relationEditor.start(editResult, this.onModifyFinish);
        this.eventController.fire(L.Mixin.EventTypes.EDITTOOLSTART, { data: false });

        return true;
    },

    onModifyFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.toolController.pause();

        this.topoEditor
            .update(editResult)
            .then(this.onUpdateSuccess)
            .catch(this.onUpdateFail);
    },

    changeScene: function (geoLiveType) {

    },

    onUpdateSuccess: function (res) {
        this.toolController.continue();

        this.relationEditor.stop();

        if (res === '属性值未发生变化') {
            return;
        }

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = [this.geoLiveType];

        // 刷新对应图层
        // this.sceneController.refreshFrozenLayer();
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 自动选中要素
        var eventArgs = {
            features: [{
                pid: res.rowkey,
                geoLiveType: this.geoLiveType
            }]
        };
        this.eventController.fire(L.Mixin.EventTypes.EDITTOOLEND, { data: true });
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, eventArgs);

        // 输出窗口输出履历,履历模块未准备好,暂时屏蔽掉
        // fastmap.uikit.editControl.EditControl.prototype.outputLogs.call(this, res.log);
    },

    onUpdateFail: function (err) {
        this.toolController.continue();

        this.eventController.fire(L.Mixin.EventTypes.EDITTOOLEND, { data: true });
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
