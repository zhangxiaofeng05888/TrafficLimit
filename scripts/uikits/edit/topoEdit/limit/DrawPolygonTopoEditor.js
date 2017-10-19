/**
 * Created by zhaohang on 2017/10/17.
 */

fastmap.uikit.topoEdit.DrawPolygonTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCopyResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.DrawPolygonResult();
        editResult.geoLiveType = 'DRAWPOLYGON';
        return editResult;
    },

    getModifyEditResult: function (options) {
        var originObject = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.PolygonResult();
        editResult.originObject = originObject;
        editResult.geoLiveType = 'DRAWPOLYGON';
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
            type: 'SCPLATERESFACE',
            command: 'UPDATE',
            geomId: editResult.originObject.pid,
            data: {
                objStatus: 'UPDATE',
                geometry: geometry
            }
        };
        return this.dataServiceFcc.copyToLine(params);
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    copy: function (editResult) {
        var links = [];
        for (var i = 0; i < editResult.links.length; i++) {
            links.push(editResult.links[i].properties.id);
        }
        var params = {
            type: 'SCPLATERESFACE',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId,
                geometryIds: links
            }
        };
        return this.dataServiceFcc.copyToLine(params);
    },

    deleteLimit: function (id) {
        var params = {
            type: 'SCPLATERESFACE',
            command: 'DELETE',
            objId: [id]
        };
        return this.dataServiceFcc.deleteLine(params);
    },

    query: function (options) {
        return {
            pid: options.pid,
            geoLiveType: options.geoLiveType,
            geometry: options.geometry
        };
    }
});
