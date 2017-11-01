/**
 * Created by zhaohang on 2017/10/31.
 */

fastmap.uikit.editControl.BatchEditLimitControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        this.highlightController.clear();
        this.setCurrentControl(this);

        var editResult = this.topoEditor.getBatchEditResult();
        this.complexEditor.start(editResult, this.onSelectFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onSelectFinish: function (editResult) {
        if (editResult.links.length > 0) {
            this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'batchEditLimit', data: editResult.links });
        }
    }
});
