/**
 * Created by zhongxiaoming on 2017/8/22.
 */

fastmap.uikit.editControl.AdjustImageControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        this.geoLiveType = 'ADJUSTIMAGE';
        // this.originObject = options.originObject;
        this.options = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = new fastmap.uikit.topoEdit.AdjustImageTopoEditor();
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getAdjustImageResult(this.options);
        this.complexEditor.start(editResult, this.onModifyFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onModifyFinish: function (editResult) {
        this.complexEditor.stop();

        if (!this.precheck(editResult)) {
            return;
        }

        this.topoEditor
          .adjustImage(editResult)
          .then(this.onUpdateSuccess)
          .catch(this.onUpdateFail);
        //  this.onUpdateSuccess(editResult);
    },

    onUpdateSuccess: function (res) {
        this.toolController.resetCurrentTool('PanTool');
        var layer = this.sceneController.getLayerById('zisan');
        this.map.eachLayer(function (l) {
            if (l.options.id === 'zisan') {
                l.redraw();
            }
        });
    },

    onUpdateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
