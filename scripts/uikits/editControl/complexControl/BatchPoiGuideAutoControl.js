/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.BatchPoiGuideAutoControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = 'IXPOI';
        this.options = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.poiBatchTopoEditor(this.map);
    },

    run: function () {
        // 注意:该流程不需要切换场景
        this.setCurrentControl(this);

        var editResult = this.topoEditor.getPoiGuideAutoEditResult();
        this.complexEditor.start(editResult, this.onModifyFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onModifyFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        var params = {
            title: '确定要执行操作吗?',
            text: '操作执行后不可撤销,请仔细确认后再执行',
            showCancelButton: true,
            allowEscapeKey: false,
            confirmButtonText: '是的，我要执行',
            confirmButtonColor: '#ec6c62'
        };

        var self = this;
        this.swalPromise(params)
            .then(function (res) {
                self.toolController.pause();

                if (res) {
                    return self.topoEditor
                               .updatePoiGuideAuto(editResult);
                }
                return null;
            })
            .then(this.onUpdateSuccess)
            .catch(this.onUpdateFail);
    },

    onUpdateSuccess: function (res) {
        this.toolController.continue();
        if (!res) {
            return;
        }

        this.complexEditor.stop();

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes([this.geoLiveType]);

        // 输出窗口输出履历,履历模块未准备好,暂时屏蔽掉
        // fastmap.uikit.editControl.EditControl.prototype.outputLogs.call(this, res.log);

        // 重新执行流程方便连续操作
        this.run();
    },

    onUpdateFail: function (err) {
        this.toolController.continue();

        // 解决在确认回调函数里再次调用swal不能正确弹出问题
        setTimeout(function () {
            swal({
                title: err,
                type: 'error',
                allowEscapeKey: false
            });
        }, 200);
    },

    swalPromise: function (params) {
        return new Promise(function (resolve, reject) {
            swal(params,
                function (value) {
                    if (value) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
        });
    }
});
