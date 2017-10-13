/**
 * Created by mali on 2017/3/23.
 * 线构面
 */
fastmap.uikit.editControl.CreateLineDimensionsControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createLineDimensionsDepart(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getBuildEditResult();
        this.complexEditor.start(editResult, this.onToolFinish);

        return true;
    },

    onToolFinish: function (editResult) {
        this.complexEditor.stop();

        if (!this.precheck(editResult)) {
            return;
        }

        this.topoEditor
            .build(editResult)
            .then(this.onCreateSuccess)
            .catch(this.onCreateFail);
    },

    onCreateSuccess: function (res) {
        this.toolController.resetCurrentTool('PanTool');

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 自动选中要素
        var eventArgs = {
            features: [{
                pid: res.pid,
                geoLiveType: this.geoLiveType
            }]
        };
        // 电子眼类型发事件，获取到的feature是数组，js抛出错误，暂时先注释
        // this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, eventArgs);

        // 输出窗口输出履历,履历模块未准备好,暂时屏蔽掉
        // fastmap.uikit.editControl.EditControl.prototype.outputLogs.call(this, res.log);

        // 重新执行流程方便连续创建
        this.run();
    },

    onCreateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
