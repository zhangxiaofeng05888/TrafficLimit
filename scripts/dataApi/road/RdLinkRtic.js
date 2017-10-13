/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkRtic = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKRTIC';
        if (!data.linkPid) {
            throw new Error('form对象没有对应link');
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
        if (typeof data.rangeType !== 'undefined') {
            this.rangeType = data.rangeType;
        } else {
            this.rangeType = 1;
        }
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
FM.dataApi.rdLinkRtic = function (data, options) {
    return new FM.dataApi.RdLinkRtic(data, options);
};

