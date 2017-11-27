/**
 * 渲染面TopoEditor
 * @author zhaohang
 * @date   2017/10/17
 * @class  fastmap.uikit.topoEdit.DrawPolygonTopoEditor
 * @return {undefined}
 */
fastmap.uikit.topoEdit.DrawPolygonTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    /**
     * 创建工具需要使用的CopyResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */

    getCopyResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.CopyResult();
        editResult.geoLiveType = 'DRAWPOLYGON';
        editResult.types = ['COPYTOPOLYGON'];
        return editResult;
    },
    /**
     * 创建工具需要使用的EditResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */
    getBatchEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'DRAWPOLYGON';
        return editResult;
    },
    /**
     * 创建工具需要使用的DeleteResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */
    getBatchDeleteResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'DRAWPOLYGON';
        return editResult;
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

    updateChanges: function (geoLiveObject) {
        var params = {
            type: 'SCPLATERESFACE',
            command: 'UPDATE',
            objIds: [geoLiveObject.pid],
            data: {
                boundaryLink: geoLiveObject.boundaryLink,
                objStatus: 'UPDATE'
            }
        };
        return this.dataServiceFcc.deleteLine(params);
    },
    /**
     * 删除
     * @param {object} id id号
     * @returns {object} params
     */
    deleteLimit: function (id) {
        var params = {
            type: 'SCPLATERESFACE',
            command: 'DELETE',
            objId: [id]
        };
        return this.dataServiceFcc.deleteLine(params);
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
