/**
 * Created by zhaohang on 2017/11/1.
 */

fastmap.uikit.editControl.BatchDeleteLimitControl = fastmap.uikit.editControl.EditControl.extend({
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

        var editResult = this.topoEditor.getBatchDeleteResult();
        this.complexEditor.start(editResult, this.onSelectFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onSelectFinish: function (editResult) {
        var self = this;
        if (editResult.links.length > 0) {
            if (this.geoLiveType === 'LIMITLINE') {
                this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, {
                    panelName: 'batchDeleteLimitLine',
                    data: editResult.links
                });
            } else {
                this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, {
                    panelName: 'batchDeleteLimit',
                    data: editResult.links
                });
            }
        }
        this.eventController.on(L.Mixin.EventTypes.BATCHDELETELIMIT, function (data) {
            self.onDeleteFinish();
        });
    },

    onDeleteFinish: function () {
        this.complexEditor.stop();
        if (this.geoLiveType === 'GEOMETRYLINE' || this.geoLiveType === 'GEOMETRYPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHRESULTLIST);
        } else if (this.geoLiveType === 'COPYTOLINE' || this.geoLiveType === 'DRAWPOLYGON') {
            // 删除临时面 临时线成功后，刷新临时几何列表
            this.eventController.fire(L.Mixin.EventTypes.REFRESHTEMPORARYLIST);
        } else if (this.geoLiveType === 'COPYTOPOLYGON') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHSPARELINE);
        } else if (this.geoLiveType === 'LIMITLINE') {
            this.eventController.fire(L.Mixin.EventTypes.REFRESHINTERSECTLINELIST);
        }
        this.sceneController.redrawLayerByGeoLiveTypes([this.geoLiveType]);
    }

});
