
/**
 * 复制到线TopoEditor
 * @author zhaohang
 * @date   2017/10/16
 * @class  fastmap.uikit.topoEdit.CopyToLineTopoEditor
 * @return {undefined}
 */
fastmap.uikit.topoEdit.CopyToLineTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        editResult.geoLiveType = 'COPYTOLINE';
        return editResult;
    },

    /**
     * 创建工具需要使用的DeleteResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */

    getBatchDeleteResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchEditLimitResult();
        editResult.geoLiveType = 'COPYTOLINE';
        return editResult;
    },

    /**
     * 创建工具需要使用的CopyResult
     * @param {object} options 包括选项
     * @returns {object} editResult 编辑结果
     */

    getCopyResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.CopyResult();
        editResult.geoLiveType = 'COPYTOLINE';
        editResult.types = ['RDLINK'];
        return editResult;
    },

    /**
     * 创建接口
     * @param  {object} editResult 编辑结果
     */

    copy: function (editResult) {
        var links = [];
        for (var i = 0; i < editResult.links.length; i++) {
            links.push(editResult.links[i].properties.id);
        }
        var params = {
            type: 'SCPLATERESLINK',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId,
                links: links
            }
        };
        return this.dataServiceFcc.copyToLine(params);
    },

    /**
     * 更新
     * @param {object} geoLiveObject 几何对象
     */

    updateChanges: function (geoLiveObject) {
        var params = {
            type: 'SCPLATERESLINK',
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
     * @param {object} id  id号
     */

    deleteLimit: function (id) {
        var params = {
            type: 'SCPLATERESLINK',
            command: 'DELETE',
            objId: [id]
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

