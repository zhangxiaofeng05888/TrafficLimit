/**
 * Created by zhongxiaoming on 2017/8/18.
 */

fastmap.uikit.editControl.TipLinkUpDownDepartControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        this.base = fastmap.uikit.editControl.EditControl.prototype;
        this.base.initialize.apply(this, map);

        this.geoLiveType = options.originObject.geoLiveType;
        this.options = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTipsTopoEditor('TIPLINKCOPY', this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getCreateEditResult(this.options);
        this.complexEditor.start(editResult, this.onModifyFinish);
        this.eventController.fire(L.Mixin.EventTypes.EDITTOOLSTART, { data: false });

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    changeScene: function (geoLiveType) {

    },

    onModifyFinish: function (editResult) {
        this.toolController.pause();
        if (!this.precheck(editResult)) {
            return;
        }
        this.topoEditor
          .create(editResult)
          .then(this.onCreateSuccess)
          .catch(this.onCreateFail);
    },

    onCreateSuccess: function (res) {
        this.toolController.clearCurrentTool();
        this.eventController.fire(L.Mixin.EventTypes.EDITTOOLEND, { data: true });
        this.toolController.resetCurrentTool('PanTool');
        this.sceneController.redrawLayerByGeoLiveTypes('TIPLINKS');
    },

    onUpdateFail: function (err) {
        this.toolController.continue();
        this.eventController.fire(L.Mixin.EventTypes.EDITTOOLEND, { data: true });
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
