/**
 * Created by wangmingdong on 2017/3/27.
 */

fastmap.uikit.topoEdit.RdSeriesBranchTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.LinkNodeViasLinkResult();
        editResult.geoLiveType = 'RDSERIESBRANCH';
        editResult.branchType = 7;
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
        editResult.geoLiveType = 'RDSERIESBRANCH';
        editResult.selectType = 'outLink';
        editResult.relationshipType = obj.relationshipType;
        editResult.inLink = this.featureSelector.selectByFeatureId(obj.inLinkPid, 'RDLINK');
        editResult.inNode = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        // editResult.outLink = this.featureSelector.selectByFeatureId(obj.outLinkPid, 'RDLINK');
        return editResult;
    },

    /**
     * 修改经过线
     * @param options
     * @returns {null}
     */
    getModifyViaResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkNodeViasLinkResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDSERIESBRANCH';
        editResult.selectType = 'viaLink';
        editResult.relationshipType = obj.relationshipType;
        editResult.inLink = this.featureSelector.selectByFeatureId(obj.inLinkPid, 'RDLINK');
        editResult.inNode = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        editResult.outLink = this.featureSelector.selectByFeatureId(obj.outLinkPid, 'RDLINK');
        editResult.vias = [];
        return editResult;
    },

    /**
     * 转化geoLiveType，如：分歧10种类型
     * 子类需要重写此方法
     * @param geoLiveType
     * @returns {null}
     */
    getServerFeatureType: function (geoLiveType) {
        return 'RDBRANCH';
    },

    /**
     * 获取对象的标识
     * @param geoLiveObject
     */
    getId: function (geoLiveObject) {
        return geoLiveObject.branchPid;
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param options
     */
    query: function (options) {
        var pid = options.pid;
        return this.dataService.getBranchByRowId(pid, 7, options.dbId);
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            branchType: 7,
            inLinkPid: editResult.inLink.properties.id,
            nodePid: editResult.inNode.properties.id,
            outLinkPid: editResult.outLink.properties.id,
            relationshipType: editResult.relationshipType,
            vias: []
        };
        for (var i = 0; i < editResult.vias.length; i++) {
            data.vias.push(editResult.vias[i].properties.id);
        }
        var _self = this;
        return this.dataService.create('RDBRANCH', data).then(function (res) {
            res.pid = _self.getDetailPidFromResponse(res);
            return res;
        });
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
                        originData.vias.push(FM.dataApi.rdBranchVia({ linkPid: editResult.vias[i].properties.id, seqNum: i + 1 }));
                    }
                }
            }
        } else {
            for (var m = 0; m < editResult.vias.length; m++) {
                originData.vias.push(FM.dataApi.rdBranchVia({ linkPid: editResult.vias[m].properties.id, seqNum: m + 1 }));
            }
        }

        var data = originData.getChanges();
        if (data) {
            return this.dataService.update('RDBRANCH', data);
        }

        return Promise.resolve('属性值未发生变化');
    },

    /**
     * 更新变化属性接口
     * 子类可以重写此方法
     * @param geoLiveObject 修改后的对象
     */
    updateChanges: function (geoLiveObject) {
        var pid = geoLiveObject.branchPid;
        var geoLiveType = 'RDBRANCH';
        var changes = geoLiveObject.getChanges();
        if (!changes) {
            return Promise.resolve('属性无变化');
        }
        return this.dataService.updateChanges(pid, geoLiveType, changes);
    },

    /**
     * 查询删除操作确认信息接口
     * 子类可以重写此方法
     * @param geoLiveObject 需要删除的对象
     */
    queryDeleteConfirmInfo: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var branchType = geoLiveObject.branchType;
        return this.dataService.getDeleteBranchConfirmInfoByRowId(pid, branchType);
    },

    /**
     * 删除接口
     * 子类可以重写此方法
     * @param geoLiveObject 需要删除的对象
     */
    delete: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var branchType = geoLiveObject.branchType;
        return this.dataService.deleteBranchByRowId(pid, branchType);
    }
});

