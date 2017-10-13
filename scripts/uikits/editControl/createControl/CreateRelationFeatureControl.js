/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.CreateRelationFeatureControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
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
    },

    onToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.toolController.pause();

        this._editResult = editResult;

        this.topoEditor
            .create(editResult)
            .then(this.onCreateSuccess)
            .catch(this.onCreateFail);
    },

    onCreateSuccess: function (res) {
        this.toolController.continue();

        this.relationEditor.stop();

        // var features = this.getFeaturesFromLogs(res.log);
        var features = [{
            pid: res.pid,
            geoLiveType: this.geoLiveType
        }];

        //  线限速、 条件线限速制作工具会用到relatedLinks
        if (res.relatedLinks) {
            features[0].relatedLinks = res.relatedLinks;
        }

        // 发送事件
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, {
            features: features
        });

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
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
