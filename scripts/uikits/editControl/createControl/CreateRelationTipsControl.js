/**
 * Created by zhaohang on 2017/4/1.
 */

fastmap.uikit.editControl.CreateRelationTipsControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTipsTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getCreateEditResult();
        this.relationEditor.start(editResult, this.onToolFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.relationEditor.abort();
        this.toolController.resetCurrentTool('PanTool');
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
        this.relationEditor.stop();

        var features = [{ geoLiveType: this.geoLiveType, pid: res.rowkey }];

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
    },

    getFeaturesFromLogs: function (logs) {
        var features = [];
        for (var i = 0; i < logs.length; ++i) {
            var log = logs[i];
            if (log.op === '删除') {
                continue;
            }
            var geoLiveType = this.getMainFeatureGeoLiveType(log.type);
            if (!geoLiveType) {
                continue;
            }

            features.push({
                pid: log.pid,
                geoLiveType: geoLiveType
            });
        }

        features = FM.Util.uniqueWith(features, FM.Util.isEqual);

        return features;
    }
});
