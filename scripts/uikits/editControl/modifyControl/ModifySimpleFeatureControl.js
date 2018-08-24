/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.ModifySimpleFeatureControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.options = options;
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getModifyEditResult(this.options);
        this.shapeEditor.start(editResult, this.onModifyFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.shapeEditor.abort();
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

        this.shapeEditor.stop();

        if (res === '属性值未发生变化') {
            return;
        }

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);


        if (this.geoLiveType !== 'COPYTOPOLYGON' && this.geoLiveType !== 'DRAWPOLYGON' && this.geoLiveType !== 'GEOMETRYPOLYGON' && this.geoLiveType !== 'GEOMETRYLINE') {
            var eventArgs = {
                features: [{
                    pid: res.pid,
                    geoLiveType: this.geoLiveType
                }]
            };
            // 发送事件
            this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, eventArgs);
        }

        if (this.geoLiveType == 'COPYTOPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHSPARELINE);
        } else if (this.geoLiveType == 'GEOMETRYPOLYGON' || this.geoLiveType == 'GEOMETRYLINE') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHRESULTLIST);
            this.eventController.fire(L.Mixin.EventTypes.REFRESHDEALFAILURELIST);
        } else if (this.geoLiveType == 'COPYTOLINE' || this.geoLiveType == 'DRAWPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHTEMPORARYLIST);
        }

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
