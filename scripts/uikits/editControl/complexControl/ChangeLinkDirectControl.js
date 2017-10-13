/**
 * Created by linglong on 2017/4/21.
 * 修改link方向
 */

fastmap.uikit.editControl.ChangeLinkDirectControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.originObject = options.originObject;
        this.options = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = new fastmap.uikit.topoEdit.RDLinkTopoEditor(this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getChangeLinkDirectEditResult(this.options);
        this.complexEditor.start(editResult, this.onModifyFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onModifyFinish: function (editResult) {
        this.complexEditor.stop();

        if (!this.precheck(editResult)) {
            return;
        }

        this.topoEditor
            .changeLinkDirect(editResult)
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
                // pid: res.pid,
                pid: this.originObject.pid, // poi同一关系接口不会返回poi的pid,所以取原始poi的pid
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
