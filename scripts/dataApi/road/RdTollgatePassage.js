/**
 * Created by wangmingdong on 2016/8/9.
 * Class Rdnode
 */

FM.dataApi.RdTollgatePassage = FM.dataApi.Feature.extend({
    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDTOLLGATEPASSAGE';
        this.pid = data.pid || 0;
        this.seqNum = data.seqNum || 1;
        this.tollForm = data.tollForm || 0;
        this.cardType = data.cardType || 0;
        this.vehicle = data.vehicle || 0;
        this.rowId = data.rowId || null;
        this.laneType = data.laneType || 0;
    },

    /**
     * 获取RdTollgatePassage简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.seqNum = this.seqNum;
        data.tollForm = this.tollForm;
        data.cardType = this.cardType;
        data.vehicle = this.vehicle;
        data.rowId = this.rowId;
        data.laneType = this.laneType;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTollgatePassage详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.seqNum = this.seqNum;
        data.tollForm = this.tollForm;
        data.cardType = this.cardType;
        data.vehicle = this.vehicle;
        data.rowId = this.rowId;
        data.laneType = this.laneType;
        return data;
    }
});

/** *
 * RdTollgatePassage初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdTollgatePassage = function (data, options) {
    return new FM.dataApi.RdTollgatePassage(data, options);
};
