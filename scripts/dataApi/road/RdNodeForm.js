/**
 * Created by wangtun on 2016/3/23.
 */
/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */
FM.dataApi.RdNodeForm = FM.dataApi.Feature.extend({
    
    setAttributes: function (data) {
        this.geoLiveType = 'RDNODEFORM';
        this.nodePid = data.nodePid || '';
        if (typeof data.formOfWay !== 'undefined') {
            this.formOfWay = data.formOfWay;
        } else {
            this.formOfWay = 1;
        }
        this.auxiFlag = data.auxiFlag || 0;
        this.rowId = data.rowId || null;
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
        data.formOfWay = this.formOfWay;
        data.auxiFlag = this.auxiFlag;
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
        data.formOfWay = this.formOfWay;
        data.auxiFlag = this.auxiFlag;
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
FM.dataApi.rdNodeForm = function (data, options) {
    return new FM.dataApi.RdNodeForm(data, options);
};
