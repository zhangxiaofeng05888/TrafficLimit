/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.ModifyRelationFeatureControl = fastmap.uikit.editControl.EditControl.extend({
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

        var editResult = this.topoEditor.getModifyEditResult(this.options);
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

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.relationEditor.abort();
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

        // modified by chenx on 2017-5-2, 解决属性值无变化时，不能高亮要素的问题
        // 解决方案：属性无变化时，只一遍重新选中要素的流程
        if (res !== '属性值未发生变化') {
            // 根据服务log获取发生变更的要素类型列表
            var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

            // 刷新对应图层
            this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);
        }

        // 自动选中要素
        var obj = {
            pid: this.options.originObject.pid,
            geoLiveType: this.options.originObject.geoLiveType
        };

        //  线限速、 条件线限速制作工具会用到relatedLinks
        if (res.relatedLinks) {
            obj.pid = res.pid;  //  线限速修改后，起始link有可能会变，需要重新赋值
            obj.relatedLinks = res.relatedLinks;
        }

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
