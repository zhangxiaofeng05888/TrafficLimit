/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.topoEdit.RDSameNodeTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.SamePointRelationResult();
        editResult.geoLiveType = 'RDSAMENODE';
        return editResult;
    },
    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var params = { nodes: editResult.relationFeatures };
        return this.dataService.create('RDSAMENODE', params);
    }
});

