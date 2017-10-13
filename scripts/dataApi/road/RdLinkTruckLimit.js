/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkTruckLimit = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKTRUCKLIMIT';
        if (!data.linkPid) {
            throw new Error('form对象没有对应link');
        }
        if (data.options) {
            this.options = data.options;
        }
        this.linkPid = data.linkPid || '';
        this.rowId = data.rowId || null;
        this.limitDir = data.limitDir || 0;
        this.timeDomain = data.timeDomain || '';
        this.resTrailer = data.resTrailer || 0;
        this.resWeigh = data.resWeigh || 0;
        this.resAxleLoad = data.resAxleLoad || 0;
        this.resAxleCount = data.resAxleCount || 0;
        this.resOut = data.resOut || 0;
        this.uRecord = data.uRecord || 0;
        this.uFields = data.uFields || '';
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.limitDir = this.limitDir;
        data.timeDomain = this.timeDomain;
        data.resTrailer = this.resTrailer;
        data.resWeigh = this.resWeigh;
        data.resAxleLoad = this.resAxleLoad;
        data.resAxleCount = this.resAxleCount;
        data.resOut = this.resOut;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function (boolBatch) {
        var data = {};
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.limitDir = this.limitDir;
        data.timeDomain = this.timeDomain;
        data.resTrailer = this.resTrailer;
        data.resWeigh = this.resWeigh;
        data.resAxleLoad = this.resAxleLoad;
        data.resAxleCount = this.resAxleCount;
        data.resOut = parseInt(this.resOut, 10);
        if (boolBatch) {
            data.options = this.options;
        }
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
FM.dataApi.rdLinkTruckLimit = function (data, options) {
    return new FM.dataApi.RdLinkTruckLimit(data, options);
};

