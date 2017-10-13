/**
 * Created by wangmingdong on 2017/4/26.
 */

fastmap.uikit.editControl.ModifyViaControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.options = options;
        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getModifyViaResult(this.options);
        if (editResult instanceof Promise) {
            var self = this;
            editResult.then(function (res) {
                self.relationEditor.start(res, self.onModifyFinish);
            });
        } else {
            this.relationEditor.start(editResult, this.onModifyFinish);
        }

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

    onUpdateSuccess: function (res) {
        this.toolController.continue();

        this.relationEditor.stop();

        this.toolController.resetCurrentTool('PanTool');

        if (res === '属性值未发生变化') {
            return;
        }

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 自动选中要素
        var obj = {
            pid: this.options.originObject.pid,
            geoLiveType: this.options.originObject.geoLiveType
        };
        var eventArgs = {
            features: [obj]
        };
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, eventArgs);

        // 输出窗口输出履历,履历模块未准备好,暂时屏蔽掉
        // fastmap.uikit.editControl.EditControl.prototype.outputLogs.call(this, res.log);
    },

    onUpdateFail: function (err) {
        this.toolController.continue();

        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
