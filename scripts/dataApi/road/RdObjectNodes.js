/**
 * Created by liuyang on 2016/8/24.
 * Class RdObject组成node
 */

FM.dataApi.RdObjectNodes = FM.dataApi.Feature.extend({


    setAttributes: function (data) {
        this.geoLiveType = 'RDOBJECTNODES';
        this.nodePid = data.pid;
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
        data.pid = this.nodePid;
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
        data.pid = this.nodePid;
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
FM.dataApi.rdObjectNodes = function (data, options) {
    return new FM.dataApi.RdObjectNodes(data, options);
};

