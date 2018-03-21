/**
 * Created by zhaohang on 2017/10/18.
 */

fastmap.uikit.editControl.DeleteLimitControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.geoLiveType = options.originObject.geoLiveType;
        this.pid = options.originObject.pid;
        if (this.geoLiveType === 'LIMITLINE') {
            this.geometryId = options.originObject.geometryId;
        }
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        if (this.geoLiveType === 'LIMITLINE') {
            this.topoEditor
              .deleteLimit(this.pid, this.geometryId)
              .then(this.onUpdateSuccess)
              .catch(this.onUpdateFail);
        } else {
            this.topoEditor
              .deleteLimit(this.pid)
              .then(this.onUpdateSuccess)
              .catch(this.onUpdateFail);
        }

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onUpdateSuccess: function (res) {
        this.toolController.resetCurrentTool('PanTool');

        // 根据服务log获取发生变更的要素类型列表
        var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);
        var simpleFeature = {
            pid: this.pid,
            geoLiveType: this.geoLiveType
        };
        swal('提示', '删除成功', 'success');
        if (this.geoLiveType === 'COPYTOPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHSPARELINE);
        }
        // 删除临时线、编辑线、临时面时，刷新临时几何列表
        if (this.geoLiveType === 'COPYTOLINE' || this.geoLiveType === 'COPYTOPOLYGON' || this.geoLiveType === 'DRAWPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHTEMPORARYLIST);
        }
        if (this.geoLiveType === 'GEOMETRYLINE' || this.geoLiveType === 'GEOMETRYPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHRESULTLIST);
        }
        this.eventController.fire(L.Mixin.EventTypes.CLOSESHAPEEDITPANEL);
        this.eventController.fire(L.Mixin.EventTypes.CLOSERIGHTPANEL, {
            feature: simpleFeature
        });
        // 刷新对应图层
        this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);
    },

    onUpdateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
