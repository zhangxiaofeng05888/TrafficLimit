/**
 * Created by zhaohang on 2017/10/31.
 */

fastmap.uikit.editControl.BreakEditLineControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.options = options;
        this.geoLiveType = options.originObject.geoLiveType;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        this.highlightController.clear();
        this.setCurrentControl(this);

        var editResult = this.topoEditor.getBreakResult(this.options);
        this.complexEditor.start(editResult, this.onBreakFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onBreakFinish: function (editResult) {
        this.complexEditor.stop();
        this.topoEditor
          .break(editResult)
          .then(this.onUpdateSuccess)
          .catch(this.onUpdateFail);
    },

    onUpdateSuccess: function (res) {
        this.toolController.resetCurrentTool('PanTool');

        if (res === '属性值未发生变化') {
            return;
        } else {
            swal('提示', '打断成功', 'success');
        }
        var geoLiveTypes = [this.geoLiveType];

        if (res.log && res.log[0].type == 'SCPLATERESFACE') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHSPARELINE);
        }
        if (res.log && res.log[0].type == 'SCPLATERESGEOMETRY') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHRESULTLIST);
            this.eventController.fire(L.Mixin.EventTypes.REFRESHDEALFAILURELIST);
        }
        // 刷新对应图层
        // this.sceneController.refreshFrozenLayer();
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
