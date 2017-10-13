/**
 * Created by zhaohang on 2017/3/29.
 */

fastmap.uikit.editControl.CreateSimpleTipsControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTipsTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.apply(this, arguments)) {
            return false;
        }

        var editResult = this.topoEditor.getCreateEditResult();
        this.shapeEditor.start(editResult, this.onToolFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.shapeEditor.abort();
    },

    changeScene: function (geoLiveType) {

    },

    onToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.toolController.pause();

        this.topoEditor
            .create(editResult)
            .then(this.onCreateSuccess)
            .catch(this.onCreateFail);
    },

    onCreateSuccess: function (res) {
        this.toolController.continue();

        this.shapeEditor.stop();

        var features = [{ geoLiveType: this.geoLiveType, pid: res.rowkey ? res.rowkey : res }];

        // 发送事件
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: features });

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = [this.geoLiveType];

        // 刷新对应图层
        // this.sceneController.refreshFrozenLayer();
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 输出窗口输出履历,履历模块未准备好,暂时屏蔽掉
        // this.outputLogs(res.log);

        // 重新执行流程方便连续创建
        this.run();
    },

    onCreateFail: function (err) {
        this.toolController.continue();

        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }

});
