/**
 * Created by wangmingdong on 2016/8/4.
 * Class RdDirectRoute
 */

FM.dataApi.RdDirectRoute = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDDIRECTROUTE';
        this.pid = data.pid || '';
        this.nodePid = data.nodePid;
        this.rowId = data.rowId || null;
        this.inLinkPid = data.inLinkPid;
        this.outLinkPid = data.outLinkPid;
        if (data.flag == undefined) {
            this.flag = 2;
        } else {
            this.flag = data.flag;
        }
        if (data.processFlag == undefined) {
            this.processFlag = 1;
        } else {
            this.processFlag = data.processFlag;
        }
        this.vias = [];
        for (var i = 0; i < data.vias.length; i++) {
            var via = FM.dataApi.rdDirectRouteVia(data.vias[i]);
            this.vias.push(via);
        }
        this.relationshipType = data.relationshipType || 1;
    },

    /**
     * 获取RdDirectRoute简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = parseInt(this.pid, 10);
        data.nodePid = parseInt(this.nodePid, 10);
        data.inLinkPid = parseInt(this.inLinkPid, 10);
        data.outLinkPid = parseInt(this.outLinkPid, 10);
        data.flag = parseInt(this.flag, 10);
        data.processFlag = parseInt(this.processFlag, 10);
        data.relationshipType = parseInt(this.relationshipType, 10);
        data.vias = this.vias;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdDirectRoute详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = parseInt(this.pid, 10);
        data.nodePid = parseInt(this.nodePid, 10);
        data.inLinkPid = parseInt(this.inLinkPid, 10);
        data.outLinkPid = parseInt(this.outLinkPid, 10);
        data.flag = parseInt(this.flag, 10);
        data.processFlag = parseInt(this.processFlag, 10);
        data.relationshipType = parseInt(this.relationshipType, 10);
        data.vias = this.vias;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * RdDirectRoute初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdDirectRoute = function (data, options) {
    return new FM.dataApi.RdDirectRoute(data, options);
};

