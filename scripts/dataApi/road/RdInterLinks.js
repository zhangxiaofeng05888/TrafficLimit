/**
 * Created by liuyang on 2016/8/9.
 * Class RdInter组成link
 */

FM.dataApi.RdInterLinks = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDINTERLINKS';
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
        data.rowId = this.rowId;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * rdInterLinks初始化函数
 * @param id
 * @param point 初始化rdInterLinks的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdInterLinks = function (data, options) {
    return new FM.dataApi.RdInterLinks(data, options);
};

