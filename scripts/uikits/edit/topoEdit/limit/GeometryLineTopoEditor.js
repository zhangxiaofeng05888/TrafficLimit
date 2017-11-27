/**
 * Created by zhaohang on 2017/10/19.
 */

fastmap.uikit.topoEdit.GeometryLineTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    getBatchEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'GEOMETRYLINE';
        return editResult;
    },

    getBatchDeleteResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'GEOMETRYLINE';
        return editResult;
    },

    updateChanges: function (geoLiveObject) {
        var params = {
            type: 'SCPLATERESGEOMETRY',
            command: 'UPDATE',
            objId: geoLiveObject.pid,
            data: {
                boundaryLink: geoLiveObject.boundaryLink,
                objStatus: 'UPDATE'
            }
        };
        return this.dataServiceFcc.deleteLine(params);
    },

    deleteLimit: function (id) {
        var params = {
            type: 'SCPLATERESGEOMETRY',
            command: 'DELETE',
            objIds: [id]
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
            groupId: options.groupId,
            boundaryLink: options.boundaryLink
        };
    }
});

