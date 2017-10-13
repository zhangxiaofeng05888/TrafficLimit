/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkZone = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKZONE';
        if (!data.linkPid) {
            throw new Error('form对象没有对应link');
        }
        if (data.options) {
            this.options = data.options;
        }
        this.linkPid = data.linkPid || '';
        this.rowId = data.rowId || null;
        this.regionId = data.regionId || 0;
        this.type = data.type || 0;
        this.side = data.side || 0;
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
        data.regionId = this.regionId;
        data.type = this.type;
        data.side = this.side;
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
        data.regionId = this.regionId;
        data.type = this.type;
        data.side = this.side;
        // data.geoLiveType = this.geoLiveType;
        if (boolBatch) {
            data.options = this.options;
        }
        return data;
    }
});

/** *
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
FM.dataApi.rdLinkZone = function (data, options) {
    return new FM.dataApi.RdLinkZone(data, options);
};

