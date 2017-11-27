/**
 * 几何成果线TopoEditor
 * @author zhaohang
 * @date   2017/10/19
 * @class fastmap.uikit.topoEdit.GeometryLineTopoEditor
 * @return {undefined}
 */
fastmap.uikit.topoEdit.GeometryLineTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        editResult.geoLiveType = 'GEOMETRYLINE';
        return editResult;
    },
    /**
     * 创建工具需要使用的DeleteResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */
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

