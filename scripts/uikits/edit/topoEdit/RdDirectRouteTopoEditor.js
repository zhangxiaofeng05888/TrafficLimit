/**
 * Created by zhaohang on 2017/3/28.
 */
fastmap.uikit.topoEdit.RDDirectRouteTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.LinkNodeViasLinkResult();
        editResult.geoLiveType = 'RDDIRECTROUTE';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkNodeViasLinkResult();
        editResult.originObject = obj;
        editResult.selectType = 'outLink';
        editResult.geoLiveType = 'RDDIRECTROUTE';
        editResult.inLink = this.featureSelector.selectByFeatureId(obj.inLinkPid, 'RDLINK');
        editResult.inNode = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        return editResult;
    },

    /**
     * 转化geoLiveType
     * 子类需要重写此方法
     * @param geoLiveType
     * @returns {null}
     */
    getServerFeatureType: function (geoLiveType) {
        return 'RDDIRECTROUTE';
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            inLinkPid: editResult.inLink.properties.id,
            nodePid: editResult.inNode.properties.id,
            outLinkPid: editResult.outLink.properties.id,
            relationshipType: editResult.relationshipType,
            vias: []
        };
        for (var i = 0; i < editResult.vias.length; i++) {
            data.vias.push(editResult.vias[i].properties.id);
        }
        return this.dataService.create('RDDIRECTROUTE', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var originData = editResult.originObject;
        var originVias = FM.Util.clone(originData.vias);
        originData.outLinkPid = editResult.outLink.properties.id;
        if (editResult.inNode.properties.id != editResult.outLink.properties.enode && editResult.inNode.properties.id != editResult.outLink.properties.snode) {
            originData.relationshipType = 2;
        } else {
            originData.relationshipType = 1;
        }
        originData.vias = [];
        if (originVias.length) {
            for (var i = 0; i < editResult.vias.length; i++) {
                for (var j = 0; j < originVias.length; j++) {
                    if (originVias[j].linkPid == editResult.vias[i].properties.id) {
                        var newVia = originVias[j];
                        newVia.seqNum = i + 1;
                        originData.vias.push(newVia);
                        break;
                    }
                    if (j == originVias.length - 1 && originVias[j].linkPid != editResult.vias[i].properties.id) {
                        originData.vias.push(FM.dataApi.rdDirectRouteVia({ linkPid: editResult.vias[i].properties.id, seqNum: i + 1 }).getIntegrate());
                    }
                }
            }
        } else {
            for (var m = 0; m < editResult.vias.length; m++) {
                originData.vias.push(FM.dataApi.rdDirectRouteVia({ linkPid: editResult.vias[m].properties.id, seqNum: m + 1 }).getIntegrate());
            }
        }

        var data = originData.getChanges();
        if (data) {
            return this.dataService.update('RDDIRECTROUTE', data);
        }

        return Promise.resolve('属性值未发生变化');
    }
});

