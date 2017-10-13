/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.topoEdit.RDCrossTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.RDCrossResult();
        editResult.geoLiveType = 'RDCROSS';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.RDCrossResult();
        editResult.geoLiveType = 'RDCROSS';
        var originObject = options.originObject;
        editResult.originObject = originObject;

        var self = this;
        var nodePids = this.getNodePidsFromGeoLiveObject(originObject);
        var linkPids = this.getLinkPidsFromGeoLiveObject(originObject);
        var promise1 = this.uikitUtil.getCanvasFeaturesFromServer(nodePids, 'RDNODE');
        var promise2 = self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK');
        return Promise.all([promise1, promise2])
            .then(function (res) {
                editResult.nodes = res[0];
                editResult.links = res[1];
                return editResult;
            });
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var nodePids = this.getNodePidsFromEditResult(editResult);
        var linkPids = this.getLinkPidsFromEditResult(editResult);
        var data = {
            nodePids: nodePids,
            linkPids: linkPids
        };
        return this.dataService.create('RDCROSS', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var pid = editResult.originObject.pid;
        var nodePids = this.getNodePidsFromEditResult(editResult);
        var linkPids = this.getLinkPidsFromEditResult(editResult);
        var data = {
            pid: pid,
            nodePids: nodePids,
            linkPids: linkPids
        };
        return this.dataService.batchCross('RDCROSS', pid, data);
    },

    getNodePidsFromEditResult: function (editResult) {
        var nodePids = [];
        var nodes = editResult.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.checked) {
                nodePids.push(node.properties.id);
            }
        }
        return nodePids;
    },

    getLinkPidsFromEditResult: function (editResult) {
        var linkPids = [];
        var links = editResult.links;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            linkPids.push(link.properties.id);
        }
        return linkPids;
    },

    getNodePidsFromGeoLiveObject: function (obj) {
        var nodePids = [];
        var nodes = obj.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            nodePids.push(node.nodePid);
        }
        return nodePids;
    },

    getLinkPidsFromGeoLiveObject: function (obj) {
        var linkPids = [];
        var links = obj.links;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            linkPids.push(link.linkPid);
        }
        return linkPids;
    }
});

