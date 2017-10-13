/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.topoEdit.RDRestrictionTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.RestrictionResult();
        editResult.geoLiveType = 'RDRESTRICTION';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var originObject = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.RestrictionResult();
        editResult.geoLiveType = 'RDRESTRICTION';
        editResult.isTruckRestriction = false;
        editResult.originObject = originObject;

        var self = this;

        var promise1 = this.uikitUtil.getCanvasFeaturesFromServer([originObject.inLinkPid], 'RDLINK')
            .then(function (res) {
                editResult.inLink = res[0];
            });
        var promise2 = this.uikitUtil.getCanvasFeaturesFromServer([originObject.nodePid], 'RDNODE')
            .then(function (res) {
                editResult.node = res[0];
            });
        return Promise.all([promise1, promise2])
            .then(function (res) {
                var promies = [];
                for (var i = 0; i < originObject.details.length; ++i) {
                    var detail = originObject.details[i];
                    promies.push(self.addPart(editResult, detail));
                }
                return Promise.all(promies);
            })
            .then(function (res) {
                var currentPart = -1;
                if (editResult.parts.length > 0) {
                    currentPart = 0;
                }
                editResult.currentPart = currentPart;
                return editResult;
            });
    },

    /**
     * 按照‘调左直右’进行排序
     * @param parts
     * @returns {string}
     */
    sortParts: function (parts) {
        var temp = [
            [],
            [],
            [],
            []
        ];
        parts.forEach(function (item, index, arr) {
            if (item.type === 1) {
                temp[item.key - 1].unshift(item);
            } else {
                temp[item.key - 1].push(item);
            }
        });

        return temp[3].concat(temp[1]).concat(temp[0]).concat(temp[2]);
    },

    /**
     * 对restricInfo字段按照'调左直右'的顺序排序,如果'调左直右'出现多次时将'实地（红色）'放置在'理论（蓝色）'的前面
     * @param details
     * @returns {string}
     */
    sortRestricInfo: function (details) {
        var temp = [
            [],
            [],
            [],
            []
        ];
        details.forEach(function (item, index, arr) {
            if (item.flag === 1) {
                temp[item.restricInfo - 1].unshift(item); // 实地（红）放在理论(蓝)之前
            } else {
                temp[item.restricInfo - 1].push(item);
            }
        });
        var sortedDetails = temp[3].concat(temp[1]).concat(temp[0]).concat(temp[2]);
        var restricInfoArr = [];
        for (var i = 0, len = sortedDetails.length; i < len; i++) {
            if (sortedDetails[i].flag === 2) {
                restricInfoArr.push('[' + sortedDetails[i].restricInfo + ']');
            } else {
                restricInfoArr.push(sortedDetails[i].restricInfo);
            }
        }
        return restricInfoArr.join(',');
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var infos = [];

        editResult.parts = this.sortParts(editResult.parts);

        for (var i = 0; i < editResult.parts.length; ++i) {
            var part = editResult.parts[i];
            var arrow = part.key.toString();
            if (part.type === 2) {
                // 理论交限加上中括号
                arrow = '[' + part.key + ']';
            }
            var item = {
                relationshipType: part.relationshipType,
                arrow: arrow,
                outLinkPid: part.outLink ? part.outLink.properties.id : 0,
                vias: this.getViaLinkPids(part.viaLinks)
            };
            infos.push(item);
        }
        var data = {
            nodePid: editResult.node.properties.id,
            inLinkPid: editResult.inLink.properties.id,
            restricType: 0,
            infos: infos
        };
        return this.dataService.create('RDRESTRICTION', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var originObject = editResult.originObject;

        var detailModels = [];
        for (var i = 0; i < editResult.parts.length; ++i) {
            var part = editResult.parts[i];
            var detailModel = this.getDetailModel(part, originObject.details);
            if (detailModel) {
                this.updateDetailModel(detailModel, part);
                detailModels.push(detailModel);
            } else {
                detailModel = this.createDetailModel(originObject, part);
                detailModels.push(detailModel);
            }
        }
        originObject.details = detailModels;

        originObject.restricInfo = this.sortRestricInfo(detailModels); // update wuzhen 需要按照掉左直右的顺序排序

        // this.modifyRetricInfo(originObject);

        var data = originObject.getChanges();
        if (data) {
            return this.dataService.update('RDRESTRICTION', data);
        }

        return Promise.resolve('属性值未发生变化');
    },

    getViaLinkPidsFromDetail: function (detail) {
        var viaLinkPids = [];
        var viaLinks = detail.vias;
        for (var i = 0; i < viaLinks.length; ++i) {
            var viaLinkId = viaLinks[i];
            viaLinkPids.push(viaLinkId.linkPid);
        }

        return viaLinkPids;
    },

    getViaLinkPids: function (links) {
        var pids = [];
        for (var i = 0; i < links.length; ++i) {
            var link = links[i];
            pids.push(link.properties.id);
        }
        return pids;
    },

    addPart: function (editResult, detail) {
        var viaLinkPids = this.getViaLinkPidsFromDetail(detail);
        viaLinkPids.unshift(detail.outLinkPid);
        return this.uikitUtil.getCanvasFeaturesFromServer(viaLinkPids, 'RDLINK')
            .then(function (res) {
                var part = {
                    key: detail.restricInfo,
                    type: detail.flag,
                    viaLinks: res.slice(1, res.length),
                    outLink: res[0],
                    relationshipType: detail.relationshipType
                };
                editResult.parts.push(part);
            });
    },

    createDetailModel: function (originObject, part) {
        var data = {
            restricPid: originObject.pid,
            outLinkPid: part.outLink.properties.id,
            flag: part.type,
            restricInfo: part.key,
            relationshipType: part.relationshipType,
            vias: []
        };

        for (var i = 0; i < part.viaLinks.length; ++i) {
            data.vias.push({
                linkPid: part.viaLinks[i].properties.id,
                seqNum: i + 1
            });
        }

        return new FM.dataApi.RdRestrictionDetail(data);
    },

    updateDetailModel: function (detail, part) {
        detail.restricInfo = part.key;
        detail.flag = part.type;
        detail.outLinkPid = part.outLink.properties.id;
        this.updateViaModels(part, detail);
    },

    updateViaModels: function (part, detail) {
        var viaModels = [];
        for (var i = 0; i < part.viaLinks.length; ++i) {
            var viaLink = part.viaLinks[i];
            var viaModel = this.getViaLinkModel(viaLink, detail.vias);
            if (viaModel) {
                viaModel.seqNum = i + 1;
                viaModels.push(viaModel);
            } else {
                viaModels.push(new FM.dataApi.RdRestrictionVias({
                    detailId: detail.pid,
                    linkPid: viaLink.properties.id,
                    seqNum: i + 1
                }));
            }
        }
        detail.vias = viaModels;
    },

    getDetailModel: function (part, detailModels) {
        for (var i = 0; i < detailModels.length; ++i) {
            var detailModel = detailModels[i];
            var outLink = detailModel.outLinkPid;
            if (outLink === part.outLink.properties.id) {
                return detailModel;
            }
        }

        return null;
    },

    getViaLinkModel: function (viaLink, viaModels) {
        for (var i = 0; i < viaModels.length; ++i) {
            var viaModel = viaModels[i];
            if (viaModel.linkPid === viaLink.properties.id) {
                return viaModel;
            }
        }

        return null;
    },

    modifyRetricInfo: function (originObject) {
        var restricInfo = '';
        for (var i = 0; i < originObject.details.length; ++i) {
            restricInfo += originObject.details[i].restricInfo + ',';
        }
        restricInfo = restricInfo.substr(0, restricInfo.length - 1);
        originObject.restricInfo = restricInfo;
    }
});
