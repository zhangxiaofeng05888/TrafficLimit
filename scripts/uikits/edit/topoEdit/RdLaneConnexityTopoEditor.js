/**
 * Created by chenx on 2017/3/15.
 */
fastmap.uikit.topoEdit.RDLaneConnexityTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.LaneConnexityResult();
        editResult.geoLiveType = 'RDLANECONNEXITY';
        return editResult;
    },

    _loadTopo: function (topo) {
        var newTopo = {
            inLaneInfo: topo.inLaneInfo,
            busLaneInfo: topo.busLaneInfo,
            reachDir: topo.reachDir,
            relationship: topo.relationshipType
        };

        var links = [topo.outLinkPid];
        if (topo.vias && topo.vias.length > 0) {
            topo.vias.sort(function (a, b) {
                return a.seqNum > b.seqNum ? 1 : -1;
            });

            for (var i = 0; i < topo.vias.length; i++) {
                links.push(topo.vias[i].linkPid);
            }
        }

        return this.uikitUtil.getCanvasFeaturesFromServer(links, 'RDLINK').then(function (data) {
            newTopo.outLink = data.slice(0, 1)[0];
            newTopo.viaLinks = data.slice(1);

            return newTopo;
        });
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        // 注意这里必须要用两个clone：
        // 1.第一个clone用于与传进来的原始数据进行分割，操作过程种不改变原始数据；
        // 2.第二个clone用于把originObject与其他地方的赋值分割，以免出现改了editResult里的值导致originObject的修改；
        var obj = FM.Util.clone(options.originObject);
        var editResult = new fastmap.uikit.relationEdit.LaneConnexityResult();
        editResult.originObject = FM.Util.clone(obj);
        editResult.geoLiveType = 'RDLANECONNEXITY';
        editResult.lanes = obj.lanes;
        var topo;
        var i,
            j;

        var p = [];
        p.push(this.uikitUtil.getCanvasFeaturesFromServer([obj.inLinkPid], 'RDLINK').then(function (data) {
            editResult.inLink = data[0];
        }));
        p.push(this.uikitUtil.getCanvasFeaturesFromServer([obj.nodePid], 'RDNODE').then(function (data) {
            editResult.inNode = data[0];
        }));
        for (i = 0; i < obj.topos.length; i++) {
            p.push(this._loadTopo(obj.topos[i]).then(function (data) {
                editResult.topos.push(data);
            }));
        }

        return Promise.all(p).then(function () {
            return editResult;
        });
    },

    _mergeLaneInfo: function (lanes) {
        var lane;
        var temp = [];
        for (var k = 0; k < lanes.length; k++) {
            if (lanes[k].busDirect) {
                lane = lanes[k].direct + '<' + lanes[k].busDirect + '>';
            } else {
                lane = lanes[k].direct;
            }
            if (lanes[k].extend == 1) {
                lane = '[' + lane + ']';
            }
            temp.push(lane);
        }
        return temp.join(',');
    },

    _getLeftRightExtend: function (lanes) {
        var left = 0;
        var right = 0;
        var leftExtend = 0;
        var rightExtend = 0;
        var i;
        for (i = 0; i < lanes.length; i++) {
            if (lanes[i].extend == 1) {
                left++;
            } else {
                break;
            }
        }
        if (lanes.length == left) {
            leftExtend = Math.ceil(left / 2);
            rightExtend = Math.floor(left / 2);
        } else {
            leftExtend = left;
            for (i = lanes.length - 1; i > left; i--) {
                if (lanes[i].extend == 1) {
                    right++;
                } else {
                    break;
                }
            }
            rightExtend = right;
        }

        return {
            left: leftExtend,
            right: rightExtend
        };
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var topos = [];
        var vias;
        var topo;
        var i,
            j;
        for (i = 0; i < editResult.topos.length; i++) {
            topo = {
                outLinkPid: editResult.topos[i].outLink.properties.id,
                inLaneInfo: FM.Util.binaryArray2Decimal(editResult.topos[i].inLaneInfo),
                busLaneInfo: FM.Util.binaryArray2Decimal(editResult.topos[i].busLaneInfo),
                reachDir: editResult.topos[i].reachDir,
                relationshipType: editResult.topos[i].relationship,
                vias: []
            };
            for (j = 0; j < editResult.topos[i].viaLinks.length; j++) {
                topo.vias.push(editResult.topos[i].viaLinks[j].properties.id);
            }
            topos.push(topo);
        }
        var lr = this._getLeftRightExtend(editResult.lanes);
        var data = {
            inLinkPid: editResult.inLink.properties.id,
            nodePid: editResult.inNode.properties.id,
            laneInfo: this._mergeLaneInfo(editResult.lanes),
            laneNum: editResult.lanes.length,
            leftExtend: lr.left,
            rightExtend: lr.right,
            topos: topos
        };
        return this.dataService.create('RDLANECONNEXITY', data);
    },

    _newTopo: function (pid, newTopo) {
        var data = {
            connexityPid: pid,
            outLinkPid: newTopo.outLink.properties.id,
            inLaneInfo: FM.Util.binaryArray2Decimal(newTopo.inLaneInfo),
            busLaneInfo: FM.Util.binaryArray2Decimal(newTopo.busLaneInfo),
            reachDir: newTopo.reachDir,
            relationshipType: newTopo.relationship,
            vias: []
        };
        for (var i = 0; i < newTopo.viaLinks.length; i++) {
            data.vias.push({
                linkPid: newTopo.viaLinks[i].properties.id,
                seqNum: i + 1
            });
        }

        return new FM.dataApi.RdLaneTopology(data);
    },

    _updateTopo: function (oldTopo, newTopo) {
        oldTopo.inLaneInfo = newTopo.inLaneInfo;
        oldTopo.busLaneInfo = newTopo.busLaneInfo;
        oldTopo.reachDir = newTopo.reachDir;
        oldTopo.relationshipType = newTopo.relationship;
        var i,
            j;
        var f;
        for (i = oldTopo.vias.length - 1; i >= 0; i--) {
            f = false;
            for (j = newTopo.viaLinks.length - 1; j >= 0; j--) {
                if (oldTopo.vias[i].linkPid == newTopo.viaLinks[j].properties.id) {
                    oldTopo.vias[i].seqNum = j + 1;
                    f = true;
                    break;
                }
            }
            if (!f) {
                oldTopo.vias.splice(i, 1);
            }
        }

        for (i = 0; i < newTopo.viaLinks.length; i++) {
            f = false;
            for (j = 0; j < oldTopo.vias.length; j++) {
                if (oldTopo.vias[j].linkPid == newTopo.viaLinks[i].properties.id) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                oldTopo.vias.push(new FM.dataApi.RdLaneVIA({
                    topologyId: oldTopo.pid,
                    linkPid: newTopo.viaLinks[i].properties.id,
                    seqNum: i + 1
                }));
            }
        }
    },

    update: function (editResult) {
        var origin = editResult.originObject;
        origin.lanes = editResult.lanes;
        var i,
            j;
        var f;

        // 删除inLaneInfo和busLaneInfo都为0的topo
        for (i = 0; i < editResult.topos.length; i++) {
            if (FM.Util.binaryArray2Decimal(editResult.topos[i].inLaneInfo) === 0 && FM.Util.binaryArray2Decimal(editResult.topos[i].busLaneInfo) === 0) {
                editResult.topos.splice(i, 1);
                i--;
            }
        }

        for (i = 0; i < origin.topos.length; i++) {
            f = false;
            for (j = 0; j < editResult.topos.length; j++) {
                if (origin.topos[i].outLinkPid == editResult.topos[j].outLink.properties.id) {
                    this._updateTopo(origin.topos[i], editResult.topos[j]);
                    f = true;
                    break;
                }
            }
            if (!f) {
                origin.topos.splice(i, 1);
                i--;
            }
        }

        for (i = 0; i < editResult.topos.length; i++) {
            f = false;
            for (j = 0; j < origin.topos.length; j++) {
                if (origin.topos[j].outLinkPid == editResult.topos[i].outLink.properties.id) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                origin.topos.push(this._newTopo(origin.pid, editResult.topos[i]));
            }
        }

        var data = origin.getChanges();
        if (data) {
            return this.dataService.update('RDLANECONNEXITY', data);
        }

        return Promise.resolve('属性值未发生变化');
    }
});
