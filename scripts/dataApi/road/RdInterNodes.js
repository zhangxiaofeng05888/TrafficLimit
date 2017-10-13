/**
 * Created by liuyang on 2016/8/9.
 * Class RdInter组成node
 */

FM.dataApi.RdInterNodes = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDINTERNODES';
        this.nodePid = data.nodePid;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取组成node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.nodePid = this.nodePid;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取组成node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.nodePid = this.nodePid;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * rdInterNodes初始化函数
 * @param id
 * @param point 初始化rdInterNodes的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdInterNodes = function (data, options) {
    return new FM.dataApi.RdInterNodes(data, options);
};

