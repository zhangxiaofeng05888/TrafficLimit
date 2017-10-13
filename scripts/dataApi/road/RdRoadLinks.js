/**
 * Created by liuyang on 2016/8/9.
 * Class RdRoad组成link
 */

FM.dataApi.RdRoadLinks = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDROADLINKS';
        this.linkPid = data.linkPid;
        this.seqNum = data.seqNum || 1;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取组成link简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取组成link详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * rdRoadLinks初始化函数
 * @param id
 * @param point 初始化rdRoadLinks
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdRoadLinks = function (data, options) {
    return new FM.dataApi.RdRoadLinks(data, options);
};

