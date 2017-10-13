/**
 * Created by zhaohang on 2017/4/1.
 */

fastmap.uikit.editControl.SelectTipsAndPOIControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.eventController = fastmap.uikit.EventController();
        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.topoEditor = this.topoEditFactory.selectTipsAndPOITopoEditor(this.geoLiveType, this.map);
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
        this.relationEditor.stop();

        if (!this.precheck(editResult)) {
            return;
        }
        var tips = 0;
        var pois = 0;
        var self = this;
        editResult.tipsArray.forEach(function (item) {
            if (item.properties.geoLiveType === 'IXPOI') {
                pois++;
            } else {
                tips++;
            }
        });
        swal({
            title: '共有' + tips + '个tips,' + pois + '个poi',
            type: 'success',
            animation: 'slide-from-top',
            closeOnConfirm: true,
            showCancelButton: true,
            confirmButtonText: '提交',
            cancelButtonText: '取消'
        }, function () {
            self.topoEditor
              .create(editResult)
              .then(self.onCreateSuccess)
              .catch(self.onCreateFail);
        });
    },

    onCreateSuccess: function (res) {
        swal({
            title: '数据已经成功提交处理',
            type: 'success',
            allowEscapeKey: false
        });
        this.toolController.resetCurrentTool('PanTool');


        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(this.sceneController.getLoadedFeatureTypes());
        this.run();
        // this.eventController.fire(L.Mixin.EventTypes.ENDRELOADING);
    },

    onCreateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
        this.eventController.fire(L.Mixin.EventTypes.ENDRELOADING);
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
