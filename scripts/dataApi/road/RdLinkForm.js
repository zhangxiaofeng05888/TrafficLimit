/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */
FM.dataApi.RdLinkForm = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKFORM';
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
        if (typeof data.formOfWay !== 'undefined') {
            this.formOfWay = data.formOfWay;
        } else {
            this.formOfWay = 1;
        }
        this.extendedForm = data.extendedForm || 0;
        this.auxiFlag = data.auxiFlag || 0;
        this.kgFlag = data.kgFlag || 0;
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
        data.formOfWay = this.formOfWay;
        data.extendedForm = this.extendedForm;
        data.auxiFlag = this.auxiFlag;
        data.kgFlag = this.kgFlag;
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
        data.formOfWay = this.formOfWay;
        data.extendedForm = this.extendedForm;
        data.auxiFlag = this.auxiFlag;
        data.kgFlag = this.kgFlag;
        // data.geoLiveType = this.geoLiveType;
        // boolBatch参数为了保证批量编辑操作；zxm修改
        if (boolBatch) {
            data.options = this.options;
        }
        return data;
    }
});
/** *
 * linkform初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdLinkForm = function (data, options) {
    return new FM.dataApi.RdLinkForm(data, options);
};
