/**
 * Created by wuzhen on 2016/8/5.
 * Class RdSameNodePart 同一点组成表
 */

FM.dataApi.RdSameNodePart = FM.dataApi.Feature.extend({
    /**
     * 设置信息
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDSAMENODE';
        this.groupId = data.groupId;
        this.nodePid = data.nodePid;
        this.tableName = data.tableName;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.groupId = this.groupId;
        data.nodePid = this.nodePid;
        data.tableName = this.tableName;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * RdSameNodePart
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.groupId = this.groupId;
        data.nodePid = this.nodePid;
        data.tableName = this.tableName;
        data.rowId = this.rowId;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdSameNode初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdSameNodePart}
 */
FM.dataApi.rdSameNodePart = function (data, options) {
    return new FM.dataApi.RdSameNodePart(data, options);
};

