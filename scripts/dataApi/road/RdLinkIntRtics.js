/**
 * Created by liwanchong on 2016/3/14.
 */
FM.dataApi.RdLinkIntRtic = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKINTRTIC';
        if (!data.linkPid) {
            throw new Error('form对象没有对应link');
        } else {
            this.id = data.linkPid;
        }
        if (data.options) {
            this.options = data.options;
        }
        this.linkPid = data.linkPid || '';
        this.rowId = data.rowId || null;
        this.code = data.code || 0;
        this.rank = data.rank || 0;
        this.rticDir = data.rticDir || 0;
        this.updownFlag = data.updownFlag || 0;
        // this.rangeType = data.rangeType || 0;
        if (typeof data.rangeType !== 'undefined') {
            this.rangeType = data.rangeType;
        } else {
            this.rangeType = 1;
        }
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
        data.code = this.code;
        data.rank = this.rank;
        data.rticDir = this.rticDir;
        data.updownFlag = this.updownFlag;
        data.rangeType = this.rangeType;
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
        data.code = this.code;
        data.rank = this.rank;
        data.rticDir = this.rticDir;
        data.updownFlag = this.updownFlag;
        data.rangeType = this.rangeType;
        // data.geoLiveType = this.geoLiveType;
        // boolBatch参数为了保证批量编辑操作；zxm修改
        if (boolBatch) {
            data.options = this.options;
        }
        return data;
    }
});

/** *
 * linkrtic初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkRtic}
 */
FM.dataApi.rdLinkIntRtic = function (data, options) {
    return new FM.dataApi.RdLinkIntRtic(data, options);
};
