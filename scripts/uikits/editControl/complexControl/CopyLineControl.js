/**
 * Created by zhaohang on 2017/10/16.
 */

fastmap.uikit.editControl.CopyLineControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.geoLiveType = options;
        if (this.geoLiveType == 'COPYTOLINEANDPOLYGON') {
            this.topoEditorLine = this.topoEditFactory.createTopoEditor('COPYTOLINE', this.map);
            this.topoEditorPolygon = this.topoEditFactory.createTopoEditor('COPYTOPOLYGON', this.map);
        }
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }
        if (this.geoLiveType == 'COPYTOLINEANDPOLYGON') {
            this.complexEditor.start(this.topoEditorLine.getCopyResult(), this.onFinish);
        } else {
            var editResult = this.topoEditor.getCopyResult();
            this.complexEditor.start(editResult, this.onFinish);
        }

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onFinish: function (editResult) {
        var _this = this;
        if (!this.precheck(editResult)) {
            return;
        }
        if (this.geoLiveType == 'COPYTOLINEANDPOLYGON') {
            this.topoEditorLine
                .copy(editResult)
                .then(this.onUpdateSuccess)
                .catch(this.onUpdateFail)
                .then(function () {
                    _this.topoEditorPolygon
                    .copy(editResult)
                    .then(_this.onUpdateSuccess)
                    .catch(_this.onUpdateFail);
                });
        } else {
            this.topoEditor
            .copy(editResult)
            .then(this.onUpdateSuccess)
            .catch(this.onUpdateFail);
        }
    },

    onUpdateSuccess: function (res) {
        this.complexEditor.stop();

        if (res === '属性值未发生变化') {
            swal('提示', '重复复制，请重新选择', 'warning');
            return;
        }
        if (res.result) {
            if (res.result.err) {
                swal('提示', res.result.err, 'warning');
            }
            // 高亮并定位不连接几何
            this.eventController.fire(L.Mixin.EventTypes.ERRDRAWPOLYGON, res.result);
            return;
        }
        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        if (this.geoLiveType === 'DRAWPOLYGON') {
            swal('提示', '构面成功', 'success');
        } else {
            swal('提示', '复制成功', 'success');
        }
        // 刷新几何临时列表
        this.eventController.fire(L.Mixin.EventTypes.REFRESHTEMPORARYLIST);

        // 刷新刷新编辑线列表
        this.eventController.fire(L.Mixin.EventTypes.REFRESHSPARELINE);
        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);

        // 重新执行流程方便连续操作
        this.run();
    },

    onUpdateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
