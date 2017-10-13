/**
 * Created by linglong on 2016/7/29.
 * Class RdVariableSpeedLink
 */

FM.dataApi.RdVariableSpeedLink = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDVARIABLESPEEDLINK';
        this.pid = data.pid;
        this.linkPid = data.linkPid;
        this.seqNum = data.seqNum || 1;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取连续link简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.seqNum = this.seqNum;
        data.linkPid = this.linkPid;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取连续link详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.seqNum = this.seqNum;
        data.linkPid = this.linkPid;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdVariableSpeedLink = function (data, options) {
    return new FM.dataApi.RdVariableSpeedLink(data, options);
};

