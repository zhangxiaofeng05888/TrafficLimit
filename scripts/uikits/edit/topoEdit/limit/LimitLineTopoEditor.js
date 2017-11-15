/**
 * Created by zhaohang on 2017/11/15.
 */

fastmap.uikit.topoEdit.LimitLineTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    getBatchEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'LIMITLINE';
        return editResult;
    },

    getBatchDeleteResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'LIMITLINE';
        return editResult;
    },

    updateChanges: function (geoLiveObject) {
        var params = {
            type: 'SCPLATERESRDLINK',
            command: 'UPDATE',
            dbId: App.Temp.dbId,
            limitDir: geoLiveObject.linkDir,
            data: [{
                geometryId: geoLiveObject.geometryId,
                linkPid: geoLiveObject.pid
            }]
        };
        return this.dataServiceFcc.deleteLine(params);
    },

    deleteLimit: function (id, geometryId) {
        var params = {
            type: 'SCPLATERESRDLINK',
            command: 'DELETE',
            dbId: App.Temp.dbId,
            data: [{
                geometryId: geometryId,
                linkPid: id
            }]
        };
        return this.dataServiceFcc.deleteLine(params);
    },

    canDelete: function (geoLiveObject) {
        return false;
    },

    query: function (options) {
        return {
            pid: options.pid,
            geoLiveType: options.geoLiveType,
            geometry: options.geometry,
            linkDir: options.linkDir,
            geometryId: options.geometryId
        };
    }
});

