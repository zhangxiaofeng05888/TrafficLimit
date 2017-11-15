/**
 * Created by zhaohang on 2017/11/15.
 */

fastmap.uikit.editControl.TrackControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.geoLiveType = geoLiveType;
        this.options = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getTrackResult(this.options);
        this.complexEditor.start(editResult, this.onFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.topoEditor
          .track(editResult)
          .then(this.onUpdateSuccess)
          .catch(this.onUpdateFail);
    },

    onUpdateSuccess: function (res) {
        this.complexEditor.stop();
        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'trackLinePanel', data: res });
    },

    onUpdateFail: function (err) {
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
