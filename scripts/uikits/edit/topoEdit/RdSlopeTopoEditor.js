/**
 * Created by wuzhen on 2017/3/16.
 */
fastmap.uikit.topoEdit.RDSlopeTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.NodeLinksResult();
        editResult.geoLiveType = 'RDSLOPE';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.NodeLinksResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDSLOPE';
        editResult.inNode = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        var outLinkFeature = this.featureSelector.selectByFeatureId(obj.linkPid, 'RDLINK');
        editResult.outLink = outLinkFeature;
        editResult.joinLinks = [];
        editResult.linkLength = parseInt(outLinkFeature.properties.length, 10);
        if (obj.slopeVias && obj.slopeVias.length > 0) {
            for (var i = 0; i < obj.slopeVias.length; i++) {
                var feature = this.featureSelector.selectByFeatureId(obj.slopeVias[i].linkPid, 'RDLINK');
                editResult.joinLinks.push(feature);
                editResult.linkLength += parseInt(feature.properties.length, 10);
            }
        }
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var tempArr = [];
        for (var i = 0; i < editResult.joinLinks.length; i++) {
            tempArr.push(editResult.joinLinks[i].properties.id);
        }
        var data = {
            nodePid: editResult.inNode.properties.id,
            linkPid: editResult.outLink.properties.id,
            linkPids: tempArr,
            length: editResult.linkLength
        };
        return this.dataService.create('RDSLOPE', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var tempArr = [];
        for (var i = 0; i < editResult.joinLinks.length; i++) {
            tempArr.push(editResult.joinLinks[i].properties.id);
        }
        // var data = {
        //     pid: editResult.originObject.pid,
        //     linkPid: editResult.outLink.properties.id,
        //     linkPids: tempArr,
        //     length: editResult.linkLength
        // };
        var param = {
            objId: editResult.originObject.pid,
            linkPid: editResult.outLink.properties.id,
            linkPids: tempArr,
            length: editResult.linkLength,
            data: {}
        };

        if (editResult.outLink.properties.id !== editResult.originObject.linkPid) {
            param.data = {
                objStatus: 'UPDATE',
                linkPid: editResult.outLink.properties.id
            };
        }

        return this.dataService.updateObj('RDSLOPE', param);
    }
});

