/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.CreateSimpleFeatureControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
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

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // var features = this.getFeaturesFromLogs(res.log);

        // 自动选中要素
        if (geoLiveTypes[0] !== 'COPYTOPOLYGON') {
            var eventArgs = {
                features: [{
                    pid: res.pid,
                    geoLiveType: this.geoLiveType
                }]
            };
            // 发送事件
            this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, eventArgs);
        }

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
