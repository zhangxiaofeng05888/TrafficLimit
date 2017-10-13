/**
 * Created by linglong on 2017/8/7.
 */

fastmap.uikit.editControl.DeleteClosedVertexControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.options = options;
        this.shapeEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }
        var closeNodeFlag = false;
        var editResult = this.topoEditor.getModifyEditResult(this.options);
        var transform = new fastmap.mapApi.MecatorTranform();
        var geometry = editResult.finalGeometry.coordinates;
        for (var i = geometry.length - 1; i > 0; i--) {
            for (var j = i - 1; j > -1; j--) {
                var node1 = geometry[i];
                var node2 = geometry[j];
                var distance = transform.distance(node1[1], node1[0], node2[1], node2[0]);
                if (distance < 2 && j != 0) {
                    closeNodeFlag = true;
                    geometry.splice(j, 1);
                }
                i--;
            }
        }
        if (closeNodeFlag) {
            this.onModifyFinish(editResult);
        } else {
            swal('该link不存在相邻形状点小于2米的情况');
        }
        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.shapeEditor.abort();
    },

    onModifyFinish: function (editResult) {
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

        // 自动选中要素
        var eventArgs = {
            features: [{
                pid: res.pid,
                geoLiveType: this.geoLiveType
            }]
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
