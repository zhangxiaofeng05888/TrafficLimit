/**
 * Created by linglong on 2017/3/28.
 */

fastmap.uikit.topoEdit.AdminJoinFacesTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.complexEdit.AdminJoinFacesResult();
        editResult.geoLiveType = 'ADADMIN';
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            regionId: editResult.adAdminObj.properties.id,
            facePid: editResult.faceObj.properties.id,
            objectType: editResult.faceObj.properties.geoLiveType
        };
        return this.dataService.joinFaces('ADADMIN', data);
    }
});

