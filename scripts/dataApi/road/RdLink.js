/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */
FM.dataApi.RdLink = FM.dataApi.Feature.extend({
    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINK';
        this.pid = data.pid || null;
        this.rowId = data.rowId || null;
        this.geometry = data.geometry || null;
        this.sNodePid = data.sNodePid || null;
        this.eNodePid = data.eNodePid || null;
        this.kind = data.kind || 7;
        this.direct = data.direct || 1;
        // this.appInfo = (data.appInfo === undefined || data.appInfo === '') ? 1 : data.appInfo;
        if (typeof data.appInfo !== 'undefined') {
            this.appInfo = data.appInfo;
        } else {
            this.appInfo = 1;
        }
        // this.tollInfo = data.tollInfo || 2;
        if (typeof data.tollInfo !== 'undefined') {
            this.tollInfo = data.tollInfo;
        } else {
            this.tollInfo = 2;
        }
        // this.routeAdopt = data.routeAdopt || 2;
        if (typeof data.routeAdopt !== 'undefined') {
            this.routeAdopt = data.routeAdopt;
        } else {
            this.routeAdopt = 2;
        }
        this.multiDigitized = data.multiDigitized || 0;
        this.developState = data.developState || 0;
        this.imiCode = data.imiCode || 0;
        this.specialTraffic = data.specialTraffic || 0;
        this.functionClass = data.functionClass || 5;
        this.urban = data.urban || 0;
        this.paveStatus = data.paveStatus || 0;
        if (typeof data.laneNum != 'undefined') {
            this.laneNum = data.laneNum;
        } else {
            this.laneNum = 2;
        }
        this.laneLeft = data.laneLeft || 0;
        this.laneRight = data.laneRight || 0;
        this.laneWidthLeft = data.laneWidthLeft || 1;
        this.laneWidthRight = data.laneWidthRight || 1;
        this.laneClass = data.laneClass || 0;
        this.width = data.width || 0;
        this.isViaduct = data.isViaduct || 0;
        this.leftRegionId = data.leftRegionId || 0;
        this.rightRegionId = data.rightRegionId || 0;
        this.length = data.length || 0;
        this.meshId = data.meshId || 0;
        this.onewayMark = data.onewayMark || 0;
        this.streetLight = data.streetLight || 0;
        this.parkingLot = data.parkingLot || 0;
        this.adasFlag = data.adasFlag || 0;
        this.sidewalkFlag = data.sidewalkFlag || 0;
        this.walkstairFlag = data.walkstairFlag || 0;
        this.diciType = data.diciType || 0;
        this.walkFlag = data.walkFlag || 0;
        this.difGroupid = data.difGroupid || '';
        this.srcFlag = data.srcFlag || 6;
        this.digitalLevel = data.digitalLevel || 0;
        this.editFlag = data.editFlag || 1;
        this.truckFlag = data.truckFlag || 0;
        this.feeStd = data.feeStd || 0;
        this.feeFlag = data.feeFlag || 0;
        this.systemId = data.systemId || 0;
        this.originLinkPid = data.originLinkPid || 0;
        this.centerDivider = data.centerDivider || 0;
        this.parkingFlag = data.parkingFlag || 0;
        this.memo = data.memo || '';
        this.forms = [];
        var i;
        var len;
        if (data.forms && data.forms.length > 0) {
            for (i = 0, len = data.forms.length; i < len; i++) {
                var form = FM.dataApi.rdLinkForm(data.forms[i]);
                this.forms.push(form);
            }
        }
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (i = 0, len = data.names.length; i < len; i++) {
                var name = FM.dataApi.rdLinkName(data.names[i]);
                this.names.push(name);
            }
        }
        this.rtics = [];
        if (data.rtics && data.rtics.length > 0) {
            for (i = 0, len = data.rtics.length; i < len; i++) {
                var rtic = FM.dataApi.rdLinkRtic(data.rtics[i]);
                this.rtics.push(rtic);
            }
        }
        this.intRtics = [];
        if (data.intRtics && data.intRtics.length > 0) {
            for (i = 0, len = data.intRtics.length; i < len; i++) {
                var intRtics = FM.dataApi.rdLinkIntRtic(data.intRtics[i]);
                this.intRtics.push(intRtics);
            }
        }
        this.sidewalks = [];
        if (data.sidewalks && data.sidewalks.length > 0) {
            for (i = 0, len = data.sidewalks.length; i < len; i++) {
                var sideWalk = FM.dataApi.rdLinkSideWalk(data.sidewalks[i]);
                this.sidewalks.push(sideWalk);
            }
        }
        this.speedlimits = [];
        if (data.speedlimits && data.speedlimits.length > 0) {
            for (i = 0, len = data.speedlimits.length; i < len; i++) {
                var speeedLimit = FM.dataApi.rdLinkSpeedLimit(data.speedlimits[i]);
                this.speedlimits.push(speeedLimit);
            }
        }
        this.limits = [];
        if (data.limits && data.limits.length > 0) {
            for (i = 0, len = data.limits.length; i < len; i++) {
                var limit = FM.dataApi.rdLinkLimit(data.limits[i], data.limits[i].options ? data.limits[i].options : {});
                this.limits.push(limit);
            }
        }
        this.limitTrucks = [];
        if (data.limitTrucks && data.limitTrucks.length > 0) {
            for (i = 0, len = data.limitTrucks.length; i < len; i++) {
                var truckLimit = FM.dataApi.rdLinkTruckLimit(data.limitTrucks[i]);
                this.limitTrucks.push(truckLimit);
            }
        }
        this.walkstairs = [];
        if (data.walkstairs && data.walkstairs.length > 0) {
            for (i = 0, len = data.walkstairs.length; i < len; i++) {
                var walkStair = FM.dataApi.rdLinkWalkStair(data.walkstairs[i]);
                this.walkstairs.push(walkStair);
            }
        }
        this.zones = [];
        if (data.zones && data.zones.length > 0) {
            for (i = 0, len = data.zones.length; i < len; i++) {
                var zone = FM.dataApi.rdLinkZone(data.zones[i]);
                this.zones.push(zone);
            }
        }
        this.tmclocations = [];
        if (data.tmclocations && data.tmclocations.length > 0) {
            for (i = 0, len = data.tmclocations.length; i < len; i++) {
                var location = FM.dataApi.rdTmcLocation(data.tmclocations[i]);
                this.tmclocations.push(location);
            }
        }
        // 加入一个批量编辑选择类型字段
        if (data.batchType) {
            this.batchType = data.batchType;
        }
    },
    /**
     * 获取道路简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.geometry = this.geometry;
        data.kind = this.kind;
        data.direct = this.direct;
        data.appInfo = this.appInfo;
        data.tollInfo = this.tollInfo;
        data.routeAdopt = this.routeAdopt;
        data.multiDigitized = this.multiDigitized;
        data.developState = this.developState;
        data.imiCode = this.imiCode;
        data.geoLiveType = this.geoLiveType;
        return data;
    },
    /**
     * 获取道路详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function (boolBatch) {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kind = this.kind;
        data.direct = this.direct;
        data.appInfo = this.appInfo;
        data.tollInfo = this.tollInfo;
        data.routeAdopt = this.routeAdopt;
        data.multiDigitized = this.multiDigitized;
        data.developState = this.developState;
        data.imiCode = this.imiCode;
        data.specialTraffic = this.specialTraffic;
        data.functionClass = this.functionClass;
        data.urban = this.urban;
        data.paveStatus = this.paveStatus;
        data.laneNum = this.laneNum;
        data.laneLeft = this.laneLeft;
        data.laneRight = this.laneRight;
        data.laneWidthLeft = this.laneWidthLeft;
        data.laneWidthRight = this.laneWidthRight;
        data.laneClass = this.laneClass;
        data.width = this.width;
        data.isViaduct = this.isViaduct;
        data.leftRegionId = this.leftRegionId;
        data.rightRegionId = this.rightRegionId;
        data.geometry = this.geometry;
        data.length = this.length;
        data.meshId = this.meshId;
        data.onewayMark = this.onewayMark;
        data.streetLight = this.streetLight;
        data.parkingLot = this.parkingLot;
        data.adasFlag = this.adasFlag;
        data.sidewalkFlag = this.sidewalkFlag;
        data.walkstairFlag = this.walkstairFlag;
        data.diciType = this.diciType;
        data.walkFlag = this.walkFlag;
        data.difGroupid = this.difGroupid;
        data.srcFlag = this.srcFlag;
        data.digitalLevel = this.digitalLevel;
        data.editFlag = this.editFlag;
        data.truckFlag = this.truckFlag;
        data.feeStd = parseFloat(this.feeStd);
        data.feeFlag = this.feeFlag;
        data.systemId = this.systemId;
        data.originLinkPid = this.originLinkPid;
        data.centerDivider = this.centerDivider;
        data.parkingFlag = this.parkingFlag;
        data.memo = this.memo;
        data.geoLiveType = this.geoLiveType;
        var forms = [];
        var i;
        var len;
        for (i = 0, len = this.forms.length; i < len; i++) {
            if (!this.forms[i].deleted()) {
                forms.push(this.forms[i].getIntegrate(boolBatch));
            }
        }
        data.forms = forms;
        var limits = [];
        for (i = 0, len = this.limits.length; i < len; i++) {
            limits.push(this.limits[i].getIntegrate(boolBatch));
        }
        data.limits = limits;
        var names = [];
        for (i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate(boolBatch));
        }
        data.names = names;
        var rtics = [];
        for (i = 0, len = this.rtics.length; i < len; i++) {
            if (!this.rtics[i].deleted()) {
                rtics.push(this.rtics[i].getIntegrate(boolBatch));
            }
        }
        data.rtics = rtics;
        var intRtics = [];
        for (i = 0, len = this.intRtics.length; i < len; i++) {
            if (!this.intRtics[i].deleted()) {
                intRtics.push(this.intRtics[i].getIntegrate(boolBatch));
            }
        }
        data.intRtics = intRtics;
        var sidewalks = [];
        for (i = 0, len = this.sidewalks.length; i < len; i++) {
            sidewalks.push(this.sidewalks[i].getIntegrate(boolBatch));
        }
        data.sidewalks = sidewalks;
        var speedlimits = [];
        for (i = 0, len = this.speedlimits.length; i < len; i++) {
            speedlimits.push(this.speedlimits[i].getIntegrate(boolBatch));
        }
        data.speedlimits = speedlimits;
        var limitTrucks = [];
        for (i = 0, len = this.limitTrucks.length; i < len; i++) {
            limitTrucks.push(this.limitTrucks[i].getIntegrate(boolBatch));
        }
        data.limitTrucks = limitTrucks;
        var walkstairs = [];
        for (i = 0, len = this.walkstairs.length; i < len; i++) {
            walkstairs.push(this.walkstairs[i].getIntegrate(boolBatch));
        }
        data.walkstairs = walkstairs;
        var zones = [];
        for (i = 0, len = this.zones.length; i < len; i++) {
            zones.push(this.zones[i].getIntegrate(boolBatch));
        }
        data.zones = zones;
        var tmclocations = [];
        for (i = 0, len = this.tmclocations.length; i < len; i++) {
            tmclocations.push(this.tmclocations[i].getIntegrate(boolBatch));
        }
        data.tmclocations = tmclocations;
        return data;
    },

    // 维护rtic是否保留;
    preserveRticExistsOrNot: function () {
        if (!this.intRtics.length && !this.rtics.length) return;
        var formTypeArr = [];
        for (var i = 0; i < this.forms.length; i++) {
            if (!this.forms[i]._deleted) {
                formTypeArr.push(this.forms[i].formOfWay);
            }
        }
        var isIntRticDeletedCondition = this.specialTraffic || this.kind > 8 || formTypeArr.indexOf(33) != -1;
        var isRticDeletedCondition = this.specialTraffic || this.kind > 8 || formTypeArr.indexOf(33) != -1 || formTypeArr.indexOf(22) != -1 || formTypeArr.indexOf(52) != -1;
        if (this.rtics.length) {
            for (var k = 0; k < this.rtics.length; k++) {
                this.rtics[k]._deleted = isRticDeletedCondition;
            }
        }
        if (this.intRtics.length) {
            for (var j = 0; j < this.intRtics.length; j++) {
                this.intRtics[j]._deleted = isIntRticDeletedCondition;
            }
        }
    },
    // 维护rtic的上下表示字段;
    _maintainRticupdownFlagInfos: function () {
        // glm53052 和glm53004 单向道路不能做下行走向
        var _self = this;
        this.rtics.forEach(function (item) {
            for (var key in item) {
                if (key === 'updownFlag' && item[key] === 1 && _self.direct != 1) {
                    item[key] = 0;
                }
            }
        });
        this.intRtics.forEach(function (item) {
            for (var key in item) {
                if (key === 'updownFlag' && item[key] === 1 && _self.direct != 1) {
                    item[key] = 0;
                }
            }
        });
    },

    /**
     * 修改种别的关联维护
     * 两个参数都必选传
     * @param newValue
     * @param oldValue
     * @param param 选传
     */
    changeKind: function (newValue, oldValue) {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        var normalSpeedLimit = null;
        for (var s = 0; s < this.speedlimits.length; s++) {
            if (this.speedlimits[s].speedType == 0) {
                normalSpeedLimit = this.speedlimits[s];
            }
        }
        this.kind = newValue;
        // 修改道路种别对道路名的维护;(当LINK种别修改为高速、城市高速、国道时，RD_LINK_NAME表中的“主从CODE”字段修改为1，其他为0)
        if (newValue == 1 || newValue == 2 || newValue == 3) {
            this.names.forEach(function (item) {
                item.code = 1;
            });
        } else {
            this.names.forEach(function (item) {
                item.code = 0;
            });
        }
        // 根据车道种别为9、10、轮渡、人渡时维护车道数和车道等级为1;
        if (newValue == 9 || newValue == 10 || newValue == 11 || newValue == 13) {
            this.laneNum = 1;
            this.laneLeft = 0;
            this.laneRight = 0;
            this.laneClass = 1;
        }
        // 如果link种别变为人渡或轮渡  要根维护限速等级
        if (newValue == 11 || newValue == 13) {
            normalSpeedLimit.speedClass = 7;
        } else {
            this._speedLimitLevel();
        }
        // 改变link种别对，普通限速的限速值的维护;
        this._limitSpeed();
        // 根据道路种别维护路径采纳字段 ，参考的是bug4修改
        if (newValue == 1) {
            this.routeAdopt = 5;
        } else if (newValue == 2 || newValue == 3) {
            this.routeAdopt = 4;
        } else if (newValue == 4 || newValue == 6 || newValue == 7) {
            this.routeAdopt = 2;
        } else if (newValue == 8 || newValue == 9 || newValue == 10 || newValue == 11 || newValue == 13) {
            this.routeAdopt = 0;
        }
        if ((newValue == 9 || newValue == 10) && (oldValue != 9 && oldValue != 10)) {
            var newLimit;
            if (this.limits.length == 0) {
                newLimit = FM.dataApi.rdLinkLimit({
                    linkPid: this.pid,
                    processFlag: 2,
                    limitDir: 0
                });
                this.limits.unshift(newLimit);
            } else {
                var temp = 0;
                for (var j = 0, limitLen = this.limits.length; j < limitLen; j++) {
                    if (this.limits[j].type == 3) {
                        this.limits[j].processFlag = 2;
                        this.limits[j].limitDir = 0;
                        temp++;
                    }
                }
                if (temp == 0) {
                    newLimit = FM.dataApi.rdLinkLimit({
                        linkPid: this.pid,
                        processFlag: 2,
                        limitDir: 0
                    });
                    this.limits.unshift(newLimit);
                }
            }
            // RTIC信息维护：道路link种别修改为9,10级时，LINK上的RTIC信息自动删除
            this.rtics.forEach(function (item) {
                item.delete();
            });
            this.intRtics.forEach(function (item) {
                item.delete();
            });
        } else if ((newValue != 9 && newValue != 10) && (oldValue == 9 || oldValue == 10)) {
            for (var k = this.limits.length - 1; k >= 0; k--) {
                if (this.limits[k].type == 3) {
                    this.limits.splice(k, 1);
                }
            }
            // RTIC信息维护：道路link种别修改为9,10级时，LINK上的RTIC信息自动删除
            this.rtics.forEach(function (item) {
                item.undelete();
            });
            this.intRtics.forEach(function (item) {
                item.undelete();
            });
        }
        // 10级路变非10级以及非10级切换为10级时对行人导航面板联动控制;
        if (newValue == 10) {
            this.walkFlag = 1;
            this.sidewalkFlag = 0;
        } else if (newValue != 10) {
            this.walkFlag = 0;
            this.sidewalkFlag = 0;
        }
        this.preserveRticExistsOrNot();
    },

    /**
     *
     * @param newValue
     * @param oldValue
     * @private 限速来源变化对等级赋值的维护;
     */
    _changeSpeedLimitSource: function (newValue, oldValue) {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        var normalSpeedLimit = null;
        for (var i = 0; i < this.speedlimits.length; i++) {
            if (this.speedlimits[i].speedType == 0) {
                normalSpeedLimit = this.speedlimits[i];
            }
        }
        // 3）对于双方向link，若存在非“未调查”、“匝道未调查”的速度限制来源，则速度限制等级值标识赋“手工赋值”；否则，赋“程序赋值”
        var limitSrcs;
        if (this.direct == 2) {
            limitSrcs = [normalSpeedLimit.fromLimitSrc];
        } else if (this.direct == 3) {
            limitSrcs = [normalSpeedLimit.toLimitSrc];
        } else {
            limitSrcs = [normalSpeedLimit.fromLimitSrc, normalSpeedLimit.toLimitSrc];
        }

        var res1 = Utils.intersectSimpleArray(limitSrcs, [0, 1]);
        var res2 = Utils.intersectSimpleArray(limitSrcs, [1, 9]) || Utils.intersectSimpleArray(limitSrcs, [1, 7]);
        if (res1.length) {
            normalSpeedLimit.speedClassWork = 0;
        } else {
            normalSpeedLimit.speedClassWork = 1;
        }
        // 如果限速来源改回未调查;
        this._limitSpeed();
    },

    /**
     *  根据限速值维护限速等级;
     * @private
     */
    _speedLimitLevel: function (flag) {
        // 在link限速值变化的任一过程中，若link上存在步行街、人渡、轮渡、POI连接路、SA/PA道路形态时，限速等级值不变
        for (var j = 0; j < this.forms.length; j++) {
            if ([12, 13, 36, 20].indexOf(this.forms[j].formOfWay) != -1) {
                return;
            }
        }
        if (this.kind == 11 || this.kind == 13) {
            return;
        }
        var normalSpeedLimit,
            speedValue;
        for (var i = 0; i < this.speedlimits.length; i++) {
            if (this.speedlimits[i].speedType == 0) {
                normalSpeedLimit = this.speedlimits[i];
            }
        }
        if (!normalSpeedLimit) {
            throw new Error('数据错误，必须得存在普通限速');
        }

        if (this.direct == 1) {
            if (normalSpeedLimit.fromSpeedLimit && normalSpeedLimit.toSpeedLimit) {
                speedValue = (normalSpeedLimit.fromSpeedLimit > normalSpeedLimit.toSpeedLimit) ? normalSpeedLimit.toSpeedLimit : normalSpeedLimit.fromSpeedLimit;
            } else {
                speedValue = normalSpeedLimit.fromSpeedLimit ? normalSpeedLimit.fromSpeedLimit : normalSpeedLimit.toSpeedLimit;
            }
            if ([7, 9].indexOf(normalSpeedLimit.fromLimitSrc) != -1 && [7, 9].indexOf(normalSpeedLimit.toLimitSrc) != -1 && normalSpeedLimit.speedClassWork == 0) {
                return;
            }
        } else if (this.direct == 2) {
            speedValue = normalSpeedLimit.fromSpeedLimit;
            // 单方向限速来源为“未调查或砸到为调查”，且等级赋值标记为“手工赋值”时，不自动更新限速等级；
            if ([0, 7, 9].indexOf(normalSpeedLimit.fromLimitSrc) != -1 && normalSpeedLimit.speedClassWork == 0) {
                return;
            }
        } else if (this.direct == 3) {
            speedValue = normalSpeedLimit.toSpeedLimit;
            // 单方向限速来源为“未调查或砸到为调查”，且等级赋值标记为“手工赋值”时，不自动更新限速等级；
            if ([0, 7, 9].indexOf(normalSpeedLimit.toLimitSrc) != -1 && normalSpeedLimit.speedClassWork == 0) {
                return;
            }
        } else if (this.direct == '-') {
            // 批量编辑
            speedValue = (normalSpeedLimit.fromSpeedLimit > normalSpeedLimit.toSpeedLimit && normalSpeedLimit.toSpeedLimit > 0) ? normalSpeedLimit.toSpeedLimit : normalSpeedLimit.fromSpeedLimit;
        }
        if (speedValue == 0) {
            normalSpeedLimit.speedClass = 0;
        } else if (speedValue < 11) {
            normalSpeedLimit.speedClass = 8;
        } else if (speedValue <= 30) {
            normalSpeedLimit.speedClass = 7;
        } else if (speedValue <= 50) {
            normalSpeedLimit.speedClass = 6;
        } else if (speedValue <= 70) {
            normalSpeedLimit.speedClass = 5;
        } else if (speedValue <= 90) {
            normalSpeedLimit.speedClass = 4;
        } else if (speedValue <= 100) {
            normalSpeedLimit.speedClass = 3;
        } else if (speedValue <= 130) {
            normalSpeedLimit.speedClass = 2;
        } else if (speedValue > 130) {
            normalSpeedLimit.speedClass = 1;
        }
        // if (this.options.boolBatch) {
        //     return;
        // }
        // 当手动修改顺行速度或逆向速度为0，来源值联动为无
        if (!flag) return;
        if (normalSpeedLimit.fromSpeedLimit == 0 && flag == 'from') {
            normalSpeedLimit.fromLimitSrc = 0;
        }
        if (normalSpeedLimit.fromSpeedLimit != 0 && flag == 'from') {
            normalSpeedLimit.fromLimitSrc = 1;
        }
        if (normalSpeedLimit.toSpeedLimit == 0 && flag == 'to') {
            normalSpeedLimit.toLimitSrc = 0;
        }
        if (normalSpeedLimit.toSpeedLimit != 0 && flag == 'to') {
            normalSpeedLimit.toLimitSrc = 1;
        }
        this._changeSpeedLimitSource();
    },

    /**
     * 修改道路形态对限速等级的维护;
     * 修改道路形态对限速值的维护;
     * 修改道路形态为砸道时维护限速等级;
     * @private
     */
    _changeRdlinkForm_speedClass: function (data) {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        var formTypeArr = [];
        var formTypeSelected = [];
        var normalSpeedLimit = null;
        for (var s = 0; s < this.speedlimits.length; s++) {
            if (this.speedlimits[s].speedType == 0) {
                normalSpeedLimit = this.speedlimits[s];
            }
        }
        for (var i = 0; i < this.forms.length; i++) {
            if (!this.forms[i]._deleted) {
                formTypeArr.push(this.forms[i].formOfWay);
            } else {
                formTypeSelected.push(this.forms[i].formOfWay);
            }
        }
        // 如果道路形态存在“步行街”等级为8维护限速等级;
        if (formTypeArr.indexOf(20) != -1) {
            normalSpeedLimit.speedClass = 8;
        }
        // 道路形态新增变更为“15匝道”时，限速来源由未调查更新为匝道未调查；
        // 道路形态删除“15匝道”时，限速来源由“匝道未调查”更新为“未调查”
        if (formTypeArr.indexOf(15) != -1) {
            if (this.direct == 1) {
                normalSpeedLimit.fromLimitSrc = 7;
                normalSpeedLimit.toLimitSrc = 7;
            } else if (this.direct == 2) {
                normalSpeedLimit.fromLimitSrc = 7;
                normalSpeedLimit.toLimitSrc = 9;
            } else if (this.direct == 3) {
                normalSpeedLimit.fromLimitSrc = 9;
                normalSpeedLimit.toLimitSrc = 7;
            }
        }
        if (data) {
            if (data.id == 15 && formTypeSelected.indexOf(15) != -1) {
                normalSpeedLimit.fromLimitSrc = 9;
                normalSpeedLimit.toLimitSrc = 9;
            }
        }
        var pattern = /\s?(12|13|36)\s?/g;
        // 如果道路形态存在“人渡/轮渡/POI连接路/SA/PA”等维护限速等级;
        if (pattern.test(formTypeArr.join())) {
            normalSpeedLimit.speedClass = 7;
            return;
        }
        // 如果不存在上述形态则按照限速值维护限速等级;
        this._speedLimitLevel();
        // 形态改变对限速值的维护（10级道路不受影响）;
        this._limitSpeed();
        // 维护rtic
        this.preserveRticExistsOrNot();
    },

    /**
     * 修改方向的关联维护
     * 传改变后的方向
     * @param direct
     */
    changeDirect: function (param) {
        var direct = param.data.direct;
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        // 以下是对限速的维护
        for (var i = 0; i < this.speedlimits.length; i++) {
            if (direct == 2) {
                this.speedlimits[i].toLimitSrc = 0;
                this.speedlimits[i].toSpeedLimit = 0;
                if (this.speedlimits[i].fromSpeedLimit != 0) {
                    this.speedlimits[i].speedClass = this._speedLimitLevel();
                } else {
                    this.speedlimits[i].fromLimitSrc = 9;
                }
                this._changeSpeedLimitSource();
            } else if (direct == 3) {
                this.speedlimits[i].fromLimitSrc = 0;
                this.speedlimits[i].fromSpeedLimit = 0;
                if (this.speedlimits[i].toSpeedLimit != 0) {
                    this.speedlimits[i].speedClass = this._speedLimitLevel();
                } else {
                    this.speedlimits[i].toLimitSrc = 9;
                }
                this._changeSpeedLimitSource();
            } else {
                if (!this.speedlimits[i].fromLimitSrc) {
                    this.speedlimits[i].fromLimitSrc = 9;
                }
                if (!this.speedlimits[i].toLimitSrc) {
                    this.speedlimits[i].toLimitSrc = 9;
                }
                this._changeSpeedLimitSource();// 等待link改变方向可以了还需测试;
                this.speedlimits[i].fromSpeedLimit = param.originalData.speedlimits[i].fromSpeedLimit;
                this.speedlimits[i].toSpeedLimit = param.originalData.speedlimits[i].toSpeedLimit;
            }
        }
        // 以下是对车道的维护
        if (direct == 2 || direct == 3) {
            this._changeLaneClass(this.laneNum);
            this.laneLeft = this.laneRight = 0;
        } else if (this.laneNum % 2) {
            this._changeLaneClass((parseInt(this.laneNum, 10) + 1) / 2);
        } else if (!this.laneNum) {
            var temp = this.laneRight > this.laneLeft ? this.laneRight : this.laneLeft;
            this._changeLaneClass(temp);
        } else {
            this._changeLaneClass(parseInt(this.laneNum, 10) / 2);
        }
        this._limitSpeed();
        // 方向改变维护rtic信息;
        this._maintainRticupdownFlagInfos();
    },

    // 根据道路级别，单双方向，是否urban属性返回限速值;
    _getSpeedLimt3_7: function (LaneNum, direct, isUrban) {
        var tempVar = 0;
        if (direct == 1) {
            switch (LaneNum) {
                case 0:
                    tempVar = 0;
                    break;
                case 1:
                    tempVar = isUrban ? 40 : 50;
                    break;
                case 2:
                    tempVar = isUrban ? 50 : 60;
                    break;
                case 3:
                    tempVar = isUrban ? 60 : 70;
                    break;
                default:
                    tempVar = isUrban ? 70 : 80;
                    break;
            }
        } else {
            switch (LaneNum) {
                case 0:
                    tempVar = 0;
                    break;
                case 1:
                    tempVar = isUrban ? 50 : 60;
                    break;
                case 2:
                    tempVar = isUrban ? 60 : 70;
                    break;
                case 3:
                    tempVar = isUrban ? 70 : 80;
                    break;
                default:
                    tempVar = isUrban ? 70 : 80;
                    break;
            }
        }
        return tempVar;
    },
    // 8-13级道路根据道路级别返回限速值;
    _getSpeedLimt8_13: function (rdLevel) {
        var tempVar;
        switch (rdLevel) {
            case 8:
                tempVar = 15;
                break;
            case 9:
                tempVar = 15;
                break;
            case 10:
                tempVar = 10;
                break;
            case 11:
                tempVar = 10;
                break;
            default:
                tempVar = 15;
        }
        return tempVar;
    },
    // 根据道路形态何种别的优先级获得限速值;
    _getSpeedLimitbyForm: function (formValue, currentValue) {
        var tempValue = currentValue;
        if (formValue.indexOf(52) != -1) {
            tempValue = 15;
        }
        if (this.kind == 13) {
            tempValue = currentValue;
        }
        if (formValue.indexOf(20) != -1 || this.kind == 11) {
            tempValue = 10;
        }
        if (formValue.indexOf(18) != -1) {
            tempValue = 15;
        }
        if ([9, 10].indexOf(this.kind) != -1) {
            tempValue = currentValue;
        }
        return tempValue;
    },

    // 限速之关联维护;
    _limitSpeed: function () {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        var normalSpeedLimit = null;
        for (var s = 0; s < this.speedlimits.length; s++) {
            if (this.speedlimits[s].speedType == 0) {
                normalSpeedLimit = this.speedlimits[s];
            }
        }
        if (!normalSpeedLimit) {
            return;
        }
        // 是否是城市内道路;
        var isUrban = this.urban;
        var formTypeArr = [];
        for (var i = 0; i < this.forms.length; i++) {
            if (!this.forms[i]._deleted) {
                formTypeArr.push(this.forms[i].formOfWay);
            }
        }
        // 如果是1，2 级道路则不维护;
        if ([1, 2].indexOf(this.kind) != -1) {
            return;
        }
        if ([9, 7].indexOf(normalSpeedLimit.toLimitSrc) != -1) { // && normalSpeedLimit.fromLimitSrc != 1
            // 如果是3,4,6,7级道路
            if ([3, 4, 6, 7].indexOf(this.kind) != -1) {
                var toTemp;
                if (this.laneNum) {
                    if (this.direct == 1) {
                        toTemp = this.laneNum % 2 ? (this.laneNum + 1) / 2 : this.laneNum / 2;
                    } else {
                        toTemp = this.laneNum;
                    }
                } else {
                    toTemp = this.laneLeft;
                }
                normalSpeedLimit.toSpeedLimit = this._getSpeedLimt3_7(toTemp, this.direct, isUrban);
            } else {
                // 如果是8,9,10,11,13级道路，该种别道路的值只与中别有关，与车道数，方向以及是否urban属性没有关系;
                normalSpeedLimit.toSpeedLimit = this._getSpeedLimt8_13(this.kind);
            }
            // 根据种别形态优先级重新维护限速值；
            normalSpeedLimit.toSpeedLimit = this._getSpeedLimitbyForm(formTypeArr, normalSpeedLimit.toSpeedLimit);
        }
        // 维护顺向来源;
        if ([9, 7].indexOf(normalSpeedLimit.fromLimitSrc) != -1) { //  && normalSpeedLimit.toLimitSrc != 1
            // 如果是3,4,6,7级道路
            if ([3, 4, 6, 7].indexOf(this.kind) != -1) {
                var fromTemp;
                if (this.laneNum) {
                    if (this.direct == 1) {
                        fromTemp = this.laneNum % 2 ? (this.laneNum + 1) / 2 : this.laneNum / 2;
                    } else {
                        fromTemp = this.laneNum;
                    }
                } else {
                    fromTemp = this.laneRight;
                }
                normalSpeedLimit.fromSpeedLimit = this._getSpeedLimt3_7(fromTemp, this.direct, isUrban);
            } else {
                // 如果是8,9,10,11,13级道路，该种别道路的值只与中别有关，与车道数，方向以及是否urban属性没有关系;
                normalSpeedLimit.fromSpeedLimit = this._getSpeedLimt8_13(this.kind);
            }
            // 根据种别形态优先级重新维护限速值；
            normalSpeedLimit.fromSpeedLimit = this._getSpeedLimitbyForm(formTypeArr, normalSpeedLimit.fromSpeedLimit);
        }
       // 程序需要关联维护限速等级;
        this._speedLimitLevel();
    },

    /**
     * 根据laneNum修改laneClass
     * 传laneNum
     * @param laneNum
     */
    _changeLaneClass: function (laneNum) {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        if (laneNum == 0) {
            this.laneClass = 0;
        } else if (laneNum == 1) {
            this.laneClass = 1;
        } else if (laneNum >= 2 && laneNum <= 3) {
            this.laneClass = 2;
        } else {
            this.laneClass = 3;
        }
    },

    /**
     *  根据车道数维护车道幅宽；
     *  @private
     */
    _roadWidth: function () {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        // 车道幅宽维护;
        if (this.laneNum) {
            if (this.laneNum == 1) {
                this.width = 30;
            } else if (this.laneNum >= 2 && this.laneNum <= 3) {
                this.width = 55;
            } else {
                this.width = 130;
            }
        } else if (this.laneLeft || this.laneRight) {
            var temp = this.laneLeft + this.laneRight;
            if (temp == 1) {
                this.width = 30;
            } else if (temp >= 2 && temp <= 3) {
                this.width = 55;
            } else {
                this.width = 130;
            }
        } else {
            this.width = 0;
        }
    },

    /*
     * 总车道数修改对车道等级的维护；
     * */
    changeLaneNum: function () {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        if (this.laneNum < 0) {
            this.laneNum = 0;
        } else if (this.laneNum > 99) {
            this.laneNum = 99;
        }
        this.laneLeft = this.laneRight = 0;
        var tempNum = 0;
        if (this.direct == 1) {
            if (this.laneNum % 2) {
                tempNum = (this.laneNum + 1) / 2;
            } else {
                tempNum = (this.laneNum) / 2;
            }
        } else {
            tempNum = (this.laneNum);
        }
        this._changeLaneClass(tempNum);
        this._roadWidth();
        // 总车道数变化对限速值的维护;
        this._limitSpeed();
    },

    /*
     * 左右车道数修改对车道等级的维护；
     * */
    changeLeftOrRightLaneNum: function () {
        // 如果是批量编辑则去不用关联维护
        // if (this.options.boolBatch) {
        //     return;
        // }
        if (this.laneLeft < 0) {
            this.laneLeft = 0;
        } else if (this.laneLeft > 99) {
            this.laneLeft = 99;
        }
        if (this.laneRight < 0) {
            this.laneRight = 0;
        } else if (this.laneRight > 99) {
            this.laneRight = 99;
        }
        if (this.laneLeft != this.laneRight) {
            this.laneNum = 0;
        } else {
            this.laneNum = this.laneLeft + this.laneRight;
            this.changeLaneNum();
            if (this.laneNum > 99) {
                this.laneNum = 98;
            }
        }
        var temp = this.laneLeft > this.laneRight ? this.laneLeft : this.laneRight;
        if (temp) {
            this._changeLaneClass(temp);
        }
        this._roadWidth();
        // 总车道数变化对限速值的维护;
        this._limitSpeed();
    },

    /** *
     * 覆盖父类的方法，进行线对象对比
     * @param options
     */
    compareCommon: function (options) {
        var compareObj = options.compareObj || {};
        var rules = options.rules || [];
        var sameDirect = options.sameDirect;
        for (var key in this) {
            if (this.hasOwnProperty(key) && !FM.Util.isContains(rules, key)) {
                if (FM.Util.isArray(this[key])) {
                    if (this[key].length > 0 && compareObj[key].length > 0) {
                        this[key] = this._compareArr1(this, compareObj, key, sameDirect);
                    } else {
                        this[key] = [];
                    }
                } else if (FM.Util.isObject(this[key])) {
                    var com = this.compareCommon(FM.Util.clone(this[key]), FM.Util.clone(compareObj[key]));
                    this[key] = com;
                } else if (this[key] != compareObj[key]) {
                    this[key] = -1;
                }
            }
        }

        return this;
    },

    /** *
     * 对比数组，返回相同的数组项
     * @param arrayBase
     * @param arrayFrom
     * @returns {Array}
     * @private
     */
    _compareArr: function (arrayBase, arrayFrom) {
        var result = [];

        for (var i = 0, len = arrayBase.length; i < len; i++) {
            for (var j = 0, length = arrayFrom.length; j < length; j++) {
                var compareResult = FM.Util.isEmptyObject(arrayBase[i].compareDiff({
                    compareObj: arrayFrom[j],
                    rules: ['rowId', 'linkPid', 'geoLiveType', 'options', '_initHooksCalled', 'status', 'id', '_originalJson', 'seqNum']
                }));

                if (compareResult) {
                    // 保存对应关系
                    var correspondingArr = [];
                    // correspondingObj['linkPids'] = [arrayBase[i].linkPid]
                    if (arrayBase[i].options && !arrayBase[i].options.correspondingArr) {
                        arrayBase[i].options.correspondingArr = [];
                        correspondingArr = [{
                            linkPid: arrayBase[i].linkPid,
                            rowId: arrayBase[i].rowId
                        }, {
                            linkPid: arrayFrom[j].linkPid,
                            rowId: arrayFrom[j].rowId
                        }];
                    } else {
                        correspondingArr.push({
                            linkPid: arrayFrom[j].linkPid,
                            rowId: arrayFrom[j].rowId
                        });
                    }
                    arrayBase[i].options.correspondingArr = arrayBase[i].options.correspondingArr.concat(correspondingArr);
                    result.push(arrayBase[i]);
                }
            }
        }

        return result;
    },

    _compareArr1: function (Base, From, key, sameDirect) {
        var result = [];

        for (var i = 0, len = Base[key].length; i < len; i++) {
            for (var j = 0, length = From[key].length; j < length; j++) {
                var com = Base[key][i].compareDiff({
                    key: key,
                    sameDirect: sameDirect,
                    compareObj: From[key][j],
                    rules: ['rowId', 'linkPid', 'geoLiveType', 'options', '_initHooksCalled', 'status', 'id', '_originalJson', 'seqNum']
                });
                var compareResult = FM.Util.isEmptyObject(com);

                if (key == 'speedlimits' && ((From[key][j].speedType == 0 && Base[key][i].speedType == 0) || (From[key][j].speedType == 3 && Base[key][i].speedType == 3))) {
                    FM.Util.merge(Base[key][i], com);
                }

                if (compareResult || ((From[key][j].speedType == 0 && Base[key][i].speedType == 0) || (From[key][j].speedType == 3 && Base[key][i].speedType == 3))) {
                    // 保存对应关系
                    var correspondingArr = [];
                    // correspondingObj['linkPids'] = [arrayBase[i].linkPid]
                    if (Base[key][i].options && !Base[key][i].options.correspondingArr) {
                        Base[key][i].options.correspondingArr = [];
                        correspondingArr = [{
                            linkPid: Base[key][i].linkPid,
                            rowId: Base[key][i].rowId
                        }, {
                            linkPid: From[key][j].linkPid,
                            rowId: From[key][j].rowId
                        }];
                    } else {
                        correspondingArr.push({
                            linkPid: From[key][j].linkPid,
                            rowId: From[key][j].rowId
                        });
                    }
                    Base[key][i].options.correspondingArr = Base[key][i].options.correspondingArr.concat(correspondingArr);
                    result.push(Base[key][i]);
                }
            }
        }
        return result;
    },

    /** *
     * 比较link对象得到变化的属性
     * @param options
     */
    compareDiff: function (options) {
        var compareObj = options.compareObj || {};
        var rules = options.rules || [];
        var result = {};
        for (var key in this) {
            if (rules.indexOf(key) != -1) {
                continue;
            }
            // 增加对比字段原则
            if (typeof this[key] === 'number') {
                if (this[key] !== compareObj[key]) {
                    // 如果为多个link进行比较，则pid没有意义；
                    result.pid = this.pid;
                    result.objStatus = 'UPDATE';
                    result[key] = compareObj[key];
                }
            } else if (typeof this[key] === 'string') {
                if (this[key] !== compareObj[key]) {
                    // 如果为多个link进行比较，则pid没有意义；
                    result.pid = this.pid;
                    result.objStatus = 'UPDATE';
                }
            } else if (FM.Util.isArray(this[key]) && FM.Util.isArray(compareObj[key])) {
                //

                var keyArr = [];
                for (var i = 0, len = this[key].length; i < len; i++) {
                    var current = this[key][i];
                    var isContained = false;
                    var currentCompareObj = {};
                    for (var j = 0, length = compareObj[key].length; j < length; j++) {
                        if (current.rowId == compareObj[key][j].rowId) {
                            isContained = true;
                            currentCompareObj = compareObj[key][j];
                        }
                    }
                    // 如果rowid存在，则为更新或是未改变
                    if (isContained) {
                        var compareResult = this[key][i].compareDiff({
                            compareObj: currentCompareObj,
                            rules: ['options', 'linkPid']
                        });
                        if (compareResult.objStatus) {
                            keyArr.push(compareResult);
                        }
                        compareObj[key].splice(j, 1);
                    } else {
                        current.objStatus = 'DELETE';
                        keyArr.push(current);
                    }
                }

                if (compareObj[key].length != 0) {
                    keyArr = keyArr.concat(compareObj[key]);
                }

                if (keyArr.length != 0) {
                    result[key] = keyArr;
                }
            }
        }

        return result;
    },

    toCanvasFeature: function () {
        var data = {
            i: this.pid,
            g: this.geometry.coordinates,
            m: {
                a: this.kind,
                // b:this.name,
                // c: this.limits,
                d: this.direct,
                e: this.sNodePid,
                f: this.eNodePid,
                h: this.forms.map(function (it) {
                    return it.formOfWay;
                }).join(';'),
                i: this.functionClass,
                j: this.imiCode,
                k: this.length,
                l: this.specialTraffic
            }
        };
        if (this.limits.length > 0) {
            data.m.c = this.limits.map(function (it) {
                return it.type;
            }).join(';');
        }
        return new FM.dataApi.CanvasFeature.RdLink(data);
    },

    _doValidate: function () {
        var _self = this;
        this.forms.forEach(function (item) {
            if ([30, 31, 33].indexOf(item.formOfWay) != -1 && !item._deleted && _self.paveStatus === 1) {
                _self._pushError('GLM01099', '桥/隧道/环岛形态的link铺设状态不能是未铺设');
            }
        });
        if (this.specialTraffic && this.paveStatus === 1) {
            this._pushError('GLM01103', '特殊交通link铺设状态不能是未铺设');
        }
        /*
        * link限制信息的检查规则;
        * (1)除单行限制外，其他限制信息类型不能为多个;
        * (2)同一方向的单行限制不能位多个;
        * */
        if (this.limits.length) {
            var limitClasses = this._createObjByKey(this.limits, 'type');
            var singleLimitClasses = limitClasses[1] ? this._createObjByKey(limitClasses[1], 'limitDir') : {};
            for (var key1 in limitClasses) {
                if (key1 != 1) {
                    if (limitClasses[key1].length > 1) {
                        this._pushError('GLM01376_1', '一条link上不能有限制类型(单行限制除外)相同的限制信息');
                        return;
                    }
                }
            }
            for (var key2 in singleLimitClasses) {
                if (singleLimitClasses[key2].length > 1) {
                    this._pushError('GLM01376_2', '一条link的同一方向上，只能存在一条类型为单行限制的限制信息');
                    return;
                }
            }
        }
    },
    _createObjByKey: function (Arr, key) {
        var tempObj = {};
        Arr.forEach(function (item) {
            if (!tempObj[item[key]]) {
                tempObj[item[key]] = [item];
            } else {
                tempObj[item[key]].push(item);
            }
        });
        return tempObj;
    }
});

/** *
 * Rdlink初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdLink = function (data, options) {
    return new FM.dataApi.RdLink(data, options);
};
