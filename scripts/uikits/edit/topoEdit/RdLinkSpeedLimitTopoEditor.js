/**
 * Created by chenx on 2017/3/15.
 */
fastmap.uikit.topoEdit.RdLinkSpeedLimitTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.SpeedLimitResult();
        editResult.geoLiveType = 'RDLINKSPEEDLIMIT';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.SpeedLimitResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDLINKSPEEDLIMIT';
        editResult.direct = obj.direct;
        editResult.speedType = obj.speedType;
        editResult.fromSpeedLimit = obj.fromSpeedLimit;
        editResult.fromLimitSrc = obj.fromLimitSrc;
        editResult.toSpeedLimit = obj.toSpeedLimit;
        editResult.toLimitSrc = obj.toLimitSrc;
        editResult.speedClassWork = obj.speedClassWork;
        editResult.speedDependent = obj.speedDependent;
        editResult.timeDomain = obj.timeDomain || ''; // 服务端要求处理成空字符串

        var p = [];
        var self = this;
        p.push(this.uikitUtil.getCanvasFeaturesFromServer([obj.linkPid], 'RDLINK').then(function (data) {
            editResult.inLink = data[0];
            editResult.inNodePid = self.uikitUtil.getDirectEndNode(editResult.inLink, editResult.direct);
        }));

        p.push(this.uikitUtil.getCanvasFeaturesFromServer(obj.links, 'RDLINK').then(function (data) {
            editResult.viaLinks = data;
        }));

        return Promise.all(p).then(function () {
            return editResult;
        });
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param options
     */
    query: function (options) {
        var temp = options.pid.split('-');
        var linkPid = parseInt(temp[0], 10);
        var direct = parseInt(temp[1], 10);
        var speedType = parseInt(temp[2], 10);
        var speedDependent = parseInt(temp[3], 10);

        return this.dataService.getByPid(linkPid, 'RDLINK', options.dbId).then(function (res) {
            if (!res) {
                return null;
            }
            var data = null;
            res.speedlimits.forEach(function (item) {
                if (item.speedType === 0 && speedType === 0) {
                    data = item;
                } else if (item.speedType === 3 && speedType === 3 && item.speedDependent === speedDependent) {
                    data = item;
                }
            });
            data.geoLiveType = 'RDLINKSPEEDLIMIT';
            data.direct = direct;
            data.links = options.relatedLinks;
            return data;
        });
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var linkPids = this._getLinkPids(editResult);
        var direct = this._getDirect(editResult);
        var limitObj = this._getLimitObj(editResult, direct);
        var data = {
            linkPids: linkPids,
            direct: direct,
            linkSpeedLimit: {
                speedType: editResult.speedType,
                fromSpeedLimit: limitObj.fromSpeedLimit,
                fromLimitSrc: limitObj.fromLimitSrc,
                toSpeedLimit: limitObj.toSpeedLimit,
                toLimitSrc: limitObj.toLimitSrc,
                speedClassWork: 1,
                speedDependent: editResult.speedDependent,
                timeDomain: editResult.timeDomain
            }
        };
        return this.dataService.batch('RDLINKSPEEDLIMIT', data).then(function (res) {
            res.pid = res.log[0].pid + '-' + direct + '-' + editResult.speedType + '-' + editResult.speedDependent;
            res.relatedLinks = linkPids.slice(1);   //  去掉起始link
            return res;
        });
    },

    /**
     * 计算 linkPids, 按照服务要求, 从非追踪方向到追踪方向
     * @param editResult 编辑结果
     */
    _getLinkPids: function (editResult) {
        var linkPids = [];

        for (var i = editResult.reverseSideViaLinks.length - 1; i >= 0; i--) {
            linkPids.push(editResult.reverseSideViaLinks[i].properties.id);
        }

        linkPids.push(editResult.inLink.properties.id);

        for (i = 0; i < editResult.limitSideViaLinks.length; i++) {
            linkPids.push(editResult.limitSideViaLinks[i].properties.id);
        }

        return linkPids;
    },

    /**
     * 判断追踪方向
     * @param editResult 编辑结果
     */
    _getDirect: function (editResult) {
        var direct = -1;
        var len = editResult.reverseSideViaLinks.length;

        if (len === 0) {
            direct = editResult.direct;
        } else if (len === 1) {
            var pid = this.uikitUtil.getOtherNode(editResult.inLink, editResult.inNodePid);

            if (editResult.reverseSideViaLinks[0].properties.enode === pid) {
                direct = 2;
            } else {
                direct = 3;
            }
        } else {
            var leftLink = editResult.reverseSideViaLinks[len - 1];
            var rightLink = editResult.reverseSideViaLinks[len - 2];

            if (leftLink.properties.enode === rightLink.properties.snode || leftLink.properties.enode === rightLink.properties.enode) {
                direct = 2;
            } else {
                direct = 3;
            }
        }

        return direct;
    },

    /**
     * 如果选择了费追踪方向的link，其中最左边的link的顺逆和所选点限速的顺逆方向不同，
     * 需要将 editResult 中的顺逆限速值、来源，进行颠倒
     * @param editResult 编辑结果
     * @param direct 顺逆方向
     */
    _getLimitObj: function (editResult, direct) {
        var limitObj = {
            fromSpeedLimit: editResult.fromSpeedLimit * 10,
            fromLimitSrc: editResult.fromLimitSrc,
            toSpeedLimit: editResult.toSpeedLimit * 10,
            toLimitSrc: editResult.toLimitSrc
        };

        if (editResult.direct !== direct) {
            limitObj = {
                fromSpeedLimit: editResult.toSpeedLimit * 10,
                fromLimitSrc: editResult.toLimitSrc,
                toSpeedLimit: editResult.fromSpeedLimit * 10,
                toLimitSrc: editResult.fromLimitSrc
            };
        }

        return limitObj;
    },

    update: function (editResult) {
        var linkPids = this._getLinkPids(editResult);
        var direct = this._getDirect(editResult);
        var limitObj = this._getLimitObj(editResult, direct);
        var data = {
            linkPids: linkPids,
            direct: direct,
            linkSpeedLimit: {
                speedType: editResult.speedType,
                fromSpeedLimit: limitObj.fromSpeedLimit,
                fromLimitSrc: limitObj.fromLimitSrc,
                toSpeedLimit: limitObj.toSpeedLimit,
                toLimitSrc: limitObj.toLimitSrc,
                speedClassWork: 1,
                speedDependent: editResult.speedDependent,
                timeDomain: editResult.timeDomain
            }
        };
        return this.dataService.batch('RDLINKSPEEDLIMIT', data).then(function (res) {
            res.pid = res.log[0].pid + '-' + direct + '-' + editResult.speedType + '-' + editResult.speedDependent;
            res.relatedLinks = linkPids.slice(1);
            return res;
        });
    },

    /**
     * 更新变化属性接口
     * 子类可以重写此方法
     * @param geoLiveObject 修改后的对象
     */
    updateChanges: function (geoLiveObject) {
        var data = {
            linkPids: [geoLiveObject.linkPid].concat(geoLiveObject.links),
            direct: geoLiveObject.direct,
            linkSpeedLimit: {
                speedType: geoLiveObject.speedType,
                fromSpeedLimit: geoLiveObject.fromSpeedLimit * 10 || 0,
                fromLimitSrc: geoLiveObject.fromLimitSrc || 0,
                toSpeedLimit: geoLiveObject.toSpeedLimit * 10 || 0,
                toLimitSrc: geoLiveObject.toLimitSrc || 0,
                speedClassWork: geoLiveObject.speedClassWork,
                speedDependent: geoLiveObject.speedDependent,
                timeDomain: geoLiveObject.timeDomain
            }
        };
        return this.dataService.batch('RDLINKSPEEDLIMIT', data).then(function (res) {
            res.relatedLinks = geoLiveObject.links;
            return res;
        });
    },

    /**
     * 获取对象的标识
     * @param geoLiveObject
     */
    getId: function (geoLiveObject) {
        var arr = geoLiveObject.pid.split('-'); //  geoLiveObject.pid格式为：linkPid-direct-speedType-speedDependent
        var pid = arr[0] + '-' + arr[1];

        return pid;
    },

    /**
     * 要素是否可以删除
     * 子类可以重写
     * @param geoLiveObject
     * @returns {boolean}
     */
    canDelete: function (geoLiveObject) {
        return false;
    }
});
