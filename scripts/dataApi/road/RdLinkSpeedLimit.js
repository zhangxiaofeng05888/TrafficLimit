/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkSpeedLimit = FM.dataApi.Feature.extend({
    /**
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKSPEEDLIMIT';
        if (data.options) {
            this.options = data.options;
        }

        this.linkPid = data.linkPid;
        this.rowId = data.rowId || null;
        this.speedType = data.speedType || 0;

        if (this.speedType === 3) {
            this.geoLiveType = 'RDLINKSPEEDLIMIT_DEPENDENT';
        }

        this.fromSpeedLimit = data.fromSpeedLimit || 0;
        this.toSpeedLimit = data.toSpeedLimit || 0;
        this.speedClass = data.speedClass || 0;
        this.fromLimitSrc = data.fromLimitSrc || 0;
        this.toLimitSrc = data.toLimitSrc || 0;
        this.speedDependent = data.speedDependent || 0;
        this.timeDomain = data.timeDomain || '';
        if (typeof data.speedClassWork !== 'undefined') {
            this.speedClassWork = data.speedClassWork;
        } else {
            this.speedClassWork = 1;
        }

        // 批量编辑线限速时用
        this.direct = data.direct;
        this.pid = this.linkPid + '-' + this.direct + '-' + this.speedType + '-' + this.speedDependent;
        if (data.links) {
            this.links = data.links;
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
        data.speedType = this.speedType;
        data.fromSpeedLimit = this.fromSpeedLimit;
        data.toSpeedLimit = this.toSpeedLimit;
        data.speedClass = this.speedClass;
        data.fromLimitSrc = this.fromLimitSrc;
        data.toLimitSrc = this.toLimitSrc;
        data.speedDependent = this.speedDependent;
        data.timeDomain = this.timeDomain;
        data.speedClassWork = this.speedClassWork;
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
        data.speedType = this.speedType;
        data.fromSpeedLimit = this.fromSpeedLimit;
        data.toSpeedLimit = this.toSpeedLimit;
        data.speedClass = this.speedClass;
        data.fromLimitSrc = this.fromLimitSrc;
        data.toLimitSrc = this.toLimitSrc;
        data.speedDependent = this.speedDependent;
        data.timeDomain = this.timeDomain;
        data.speedClassWork = parseInt(this.speedClassWork, 10);
        // data.geoLiveType = this.geoLiveType;
        // boolBatch参数为了保证批量编辑操作；zxm修改
        if (boolBatch) {
            data.options = this.options;
        }
        return data;
    }
});

/** *
 * linkSpeedLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkSpeedLimit}
 */
FM.dataApi.rdLinkSpeedLimit = function (data, options) {
    return new FM.dataApi.RdLinkSpeedLimit(data, options);
};
