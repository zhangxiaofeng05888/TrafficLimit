/**
 * Created by zhaohang on 2017/10/19.
 */

fastmap.uikit.topoEdit.GeometryPolygonTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
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

    getModifyEditResult: function (options) {
        var originObject = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.PolygonResult();
        editResult.originObject = originObject;
        editResult.geoLiveType = 'GEOMETRYPOLYGON';
        var geometry = {
            type: 'LineString',
            coordinates: []
        };
        geometry.coordinates = options.originObject.geometry.coordinates[0];
        editResult.finalGeometry = geometry;
        editResult.isClosed = true;
        return editResult;
    },

    update: function (editResult) {
        var geometry = {
            type: 'Polygon',
            coordinates: [editResult.finalGeometry.coordinates]
        };
        var params = {
            type: 'SCPLATERESGEOMETRY',
            command: 'UPDATE',
            objId: editResult.originObject.pid,
            data: {
                objStatus: 'UPDATE',
                geometry: geometry
            }
        };
        return this.dataServiceFcc.copyToLine(params);
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
            boundaryLink: options.boundaryLink
        };
    }
});
