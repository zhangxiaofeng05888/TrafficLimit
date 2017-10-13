/**
 * Created by wangtun on 2015/9/9.
 * Class RdRestrictionCondition
 */

FM.dataApi.RdRestrictionCondition = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDRESTRICTIONCONDITION';
        this.detailId = data.detailId;
        this.timeDomain = data.timeDomain || '';
        this.vehicle = data.vehicle || 0;
        this.resTrailer = data.resTrailer || 0;
        this.resWeigh = data.resWeigh || 0;
        this.resAxleLoad = data.resAxleLoad || 0;
        this.resAxleCount = data.resAxleCount || 0;
        this.resOut = data.resOut || 0;
        this.rowId = data.rowId || '';
    },

    /**
     * 获取简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.detailId = this.detailId;
        data.timeDomain = this.timeDomain;
        data.vehicle = this.vehicle;
        data.resTrailer = this.resTrailer;
        data.resWeigh = this.resWeigh;
        data.resAxleLoad = this.resAxleLoad;
        data.resAxleCount = this.resAxleCount;
        data.resOut = this.resOut;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        // add by chenx on 2017-9-6
        // 去除页面编辑时加入的未编辑的空条件
        if (!(this.timeDomain || this.vehicle || this.resTrailer || this.resWeigh || this.resAxleLoad || this.resAxleCount || this.resOut)) {
            return null;
        }

        var data = {};
        data.detailId = this.detailId;
        data.timeDomain = this.timeDomain;
        data.vehicle = this.vehicle;
        data.resTrailer = this.resTrailer;
        data.resWeigh = this.resWeigh;
        data.resAxleLoad = this.resAxleLoad;
        data.resAxleCount = this.resAxleCount;
        data.resOut = this.resOut;
        data.rowId = this.rowId;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * rdRestriction
 * @param data 初始化
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
FM.dataApi.rdRestrictionCondition = function (data, options) {
    return new FM.dataApi.RdRestrictionCondition(data, options);
};
