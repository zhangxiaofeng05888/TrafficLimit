/**
 * Created by zhaohang on 2017/3/27.
 */
fastmap.uikit.topoEdit.RDVariableSpeedTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.LinkNodeLinkContinueLinkResult();
        editResult.geoLiveType = 'RDVARIABLESPEED';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkNodeLinkContinueLinkResult();
        var vias = [];
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDVARIABLESPEED';
        editResult.inLink = this.featureSelector.selectByFeatureId(obj.inLinkPid, 'RDLINK');
        editResult.outLink = this.featureSelector.selectByFeatureId(obj.outLinkPid, 'RDLINK');
        editResult.inNode = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        for (var i = 0; i < obj.vias.length; i++) {
            vias.push(this.featureSelector.selectByFeatureId(obj.vias[i].linkPid, 'RDLINK'));
        }
        editResult.continueLink = vias;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var vias = [];
        for (var i = 0; i < editResult.continueLink.length; i++) {
            vias.push(parseInt(editResult.continueLink[i].properties.id, 10));
        }
        var data = {
            inLinkPid: parseInt(editResult.inLink.properties.id, 10),
            outLinkPid: parseInt(editResult.outLink.properties.id, 10),
            nodePid: parseInt(editResult.inNode.properties.id, 10),
            vias: vias
        };
        return this.dataService.create('RDVARIABLESPEED', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var vias = [];
        for (var i = 0; i < editResult.continueLink.length; i++) {
            vias.push(parseInt(editResult.continueLink[i].properties.id, 10));
        }
        var data = {
            pid: editResult.originObject.pid,
            inLinkPid: parseInt(editResult.inLink.properties.id, 10),
            outLinkPid: parseInt(editResult.outLink.properties.id, 10),
            nodePid: parseInt(editResult.inNode.properties.id, 10),
            vias: vias
        };
        return this.dataService.update('RDVARIABLESPEED', data);
    }
});

