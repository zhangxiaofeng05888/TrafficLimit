/**
 * Created by wangmingdong on 2017/3/28.
 */

fastmap.uikit.topoEdit.RDVoiceGuideTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.LinkNodeLinksResult();
        editResult.geoLiveType = 'RDVOICEGUIDE';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkNodeLinksResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDVOICEGUIDE';
        editResult.inLink = this.featureSelector.selectByFeatureId(obj.inLinkPid, 'RDLINK');
        editResult.inNode = this.featureSelector.selectByFeatureId(obj.nodePid, 'RDNODE');
        editResult.parts = [];
        if (obj.details.length) {
            for (var i = 0; i < obj.details.length; i++) {
                var partObj = {
                    key: 0,
                    outLink: null,
                    relationshipType: 0,
                    vias: []
                };
                partObj.key = obj.details[i].outLinkPid;
                partObj.outLink = this.featureSelector.selectByFeatureId(obj.details[i].outLinkPid, 'RDLINK');
                partObj.relationshipType = obj.details[i].relationshipType;
                for (var j = 0; j < obj.details[i].vias.length; j++) {
                    partObj.vias.push(this.featureSelector.selectByFeatureId(obj.details[i].vias[j].linkPid, 'RDLINK'));
                }
                editResult.parts.push(partObj);
            }
            editResult.currentPart = obj.details.length - 1;
        }
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var i;
        var j;
        var data = {
            inLinkPid: editResult.inLink.properties.id,
            nodePid: editResult.inNode.properties.id,
            infos: []
        };
        for (i = 0; i < editResult.parts.length; i++) {
            var tempInfo = {
                outLinkPid: editResult.parts[i].key,
                relationshipType: editResult.parts[i].relationshipType,
                vias: []
            };
            for (j = 0; j < editResult.parts[i].vias.length; j++) {
                tempInfo.vias.push(editResult.parts[i].vias[j].properties.id);
            }
            data.infos.push(tempInfo);
        }
        return this.dataService.create('RDVOICEGUIDE', data);
    },

    // 循环查找原始值中的数据，如果有返回true，如果没有返回false
    isInOriginArray: function (originArray, newObject, newData, n, i) {
        for (var m = 0; m < originArray.length; m++) {
            if (originArray[m].linkPid == newObject.properties.id) {
                var newVia = originArray[m];
                newVia.seqNum = n + 1;
                newData.details[i].vias.push(newVia);
                break;
            }
            if (m == originArray.length - 1 && originArray[m].linkPid != newObject.properties.id) {
                newData.details[i].vias.push(FM.dataApi.rdVoiceGuideVia({
                    linkPid: newObject.properties.id,
                    seqNum: n + 1
                }));
            }
        }
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var originData = editResult.originObject;
        var newData = FM.Util.clone(editResult.originObject);
        var i;
        var j;
        var n;
        newData.details = [];
        if (editResult.parts.length) {
            for (i = 0; i < editResult.parts.length; i++) {
                if (originData.details.length) {
                    for (j = 0; j < originData.details.length; j++) {
                        // 如果是修改
                        if (editResult.parts[i].key == originData.details[j].outLinkPid) {
                            var originVias = FM.Util.clone(originData.details[j].vias);
                            originData.details[j].vias = [];
                            newData.details.push(originData.details[j]);
                            var partVias = editResult.parts[i].vias;
                            if (partVias.length) {
                                for (n = 0; n < partVias.length; n++) {
                                    // 从原有的details表里取出未变或更新的vias
                                    this.isInOriginArray(originVias, partVias[n], newData, n, i);
                                   /* for (m = 0; m < originVias.length; m++) {
                                        if (originVias[m].linkPid == partVias[n].properties.id) {
                                            var newVia = originVias[m];
                                            newVia.seqNum = n + 1;
                                            newData.details[i].vias.push(newVia);
                                            break;
                                        }
                                        if (m == originVias.length - 1 && originVias[m].linkPid != partVias[n].properties.id) {
                                            newData.details[i].vias.push(FM.dataApi.rdVoiceGuideVia({
                                                linkPid: partVias[n].properties.id,
                                                seqNum: n + 1
                                            }));
                                        }
                                    }*/
                                }
                            }
                            break;
                        }
                        // 如果是新增
                        if (j == originData.details.length - 1 && editResult.parts[i].key != originData.details[j].outLinkPid) {
                            var detailObj = {
                                outLinkPid: editResult.parts[i].key,
                                vias: []
                            };
                            if (editResult.parts[i].vias.length) {
                                for (n = 0; n < editResult.parts[i].vias.length; n++) {
                                    detailObj.vias.push(FM.dataApi.rdVoiceGuideVia({
                                        linkPid: editResult.parts[i].vias[n].properties.id,
                                        seqNum: n + 1
                                    }));
                                }
                            }
                            newData.details.push(FM.dataApi.rdVoiceGuideDetail(detailObj));
                        }
                    }
                }
            }
        }

        var data = newData.getChanges();
        if (data) {
            return this.dataService.update('RDVOICEGUIDE', data);
        }

        return Promise.resolve('属性值未发生变化');
    }
});

