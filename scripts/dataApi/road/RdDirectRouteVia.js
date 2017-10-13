/**
 * Created by wangmingdong on 2016/8/4.
 * Class Rdnode
 */

FM.dataApi.RdDirectRouteVia = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDDIRECTROUTEVIA';
        this.pid = data.pid || 0;
        this.groupId = data.groupId || 1;
        this.linkPid = data.linkPid;
        this.seqNum = data.seqNum || 1;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdDirectRouteVia简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdDirectRouteVia详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.rowId = this.rowId;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * RdDirectRouteVia初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdDirectRouteVia = function (data, options) {
    return new FM.dataApi.RdDirectRouteVia(data, options);
};

