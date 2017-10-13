/**
 * Created by wuzhen on 2017/3/31.
 * 用于修改poi父子关系
 */

fastmap.uikit.editControl.ModifyPoiParentControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.options = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = new fastmap.uikit.topoEdit.IxPoiTopoEditor(this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getParentEditResult(this.options);
        this.complexEditor.start(editResult, this.onModifyFinish);

        return true;
    },

    onModifyFinish: function (editResult) {
        this.complexEditor.stop();

        if (!this.precheck(editResult)) {
            return;
        }

        this.topoEditor
            .updateParent(editResult)
            .then(this.onUpdateSuccess)
            .catch(this.onUpdateFail);
    },

    onUpdateSuccess: function (res) {
        this.toolController.resetCurrentTool('PanTool');

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 自动选中要素
        var eventArgs = {
            features: [{
                pid: this.options.originObject.pid, // poi修改父接口不会返回poi的pid,所以取原始poi的pid
                geoLiveType: this.geoLiveType
            }]
        };
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, eventArgs);

        // 输出窗口输出履历,履历模块未准备好,暂时屏蔽掉
        // fastmap.uikit.editControl.EditControl.prototype.outputLogs.call(this, res.log);
    },

    onUpdateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
