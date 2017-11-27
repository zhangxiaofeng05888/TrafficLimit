/**
 * 几何成果面TopoEditor
 * @author zhaohang
 * @date   2017/10/13
 * @class  fastmap.uikit.topoEdit.GeometryPolygonTopoEditor
 * @return {undefined}
 */
fastmap.uikit.topoEdit.GeometryPolygonTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },
    /**
     * 创建工具需要使用的EditResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */
    getBatchEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'GEOMETRYPOLYGON';
        return editResult;
    },
    /**
     * 创建工具需要使用的DeleteResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */
    getBatchDeleteResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'GEOMETRYPOLYGON';
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
    /**
     * 创建工具需要使用的ModifyEditResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */
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

    /**
     * 更新
     * @param {object} editResult 编辑结果
     * @returns {object} params
     */

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
    /**
     * 删除
     * @param {object} id id号
     * @returns {object} params
     */
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
    /**
     * 查询
     * @param {object} options 包括选项
     * @returns {object} 包括pid、geoLiveType、geometry、boundaryLink
     */
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
