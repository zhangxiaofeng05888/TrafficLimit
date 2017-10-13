/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.topoEdit.RdSeTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.LinkNodeLinkResult();
        editResult.geoLiveType = 'RDSE';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkNodeLinkResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDSE';
        editResult.inLink = this.featureSelector.selectByFeatureId(obj.inLinkPid, 'RDLINK');
        editResult.node = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        editResult.outLink = this.featureSelector.selectByFeatureId(obj.outLinkPid, 'RDLINK');
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            inLinkPid: editResult.inLink.properties.id,
            nodePid: editResult.node.properties.id,
            outLinkPid: editResult.outLink.properties.id
        };
        return this.dataService.create('RDSE', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var data = {
            pid: editResult.originObject.pid,
            outLinkPid: editResult.outLink.properties.id
        };
        return this.dataService.update('RDSE', data);
    }
});

