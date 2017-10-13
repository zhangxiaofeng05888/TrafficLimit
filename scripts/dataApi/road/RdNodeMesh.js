/**
 * Created by linglong on 2016/12/20.
 */

FM.dataApi.RdNodeMesh = FM.dataApi.Feature.extend({
    
    setAttributes: function (data) {
        this.geoLiveType = 'RDNODEMESH';
        this.nodePid = data.nodePid || '';
        this.meshId = data.meshId || 0;
        this.rowId = data.rowId || '';
        if (data.options) {
            this.options = data.options;
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
        data.nodePid = this.nodePid;
        data.meshId = this.meshId;
        data.rowId = this.rowId;
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
        data.nodePid = this.nodePid;
        data.meshId = this.meshId;
        data.rowId = this.rowId;
        if (boolBatch) {
            data.options = this.options;
        }
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
FM.dataApi.rdNodeMesh = function (data, options) {
    return new FM.dataApi.RdNodeMesh(data, options);
};

