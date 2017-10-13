/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkLimit = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKLIMIT';
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
        if (typeof data.type !== 'undefined') {
            this.type = data.type;
        } else {
            this.type = 3;
        }
        this.limitDir = data.limitDir || 0;
        this.timeDomain = data.timeDomain || '';
        this.vehicle = data.vehicle || 0;
        if (typeof data.tollType !== 'undefined') {
            this.tollType = data.tollType;
        } else {
            this.tollType = 9;
        }
        if (typeof data.weather !== 'undefined') {
            this.weather = data.weather;
        } else {
            this.weather = 9;
        }
        this.inputTime = data.inputTime || '';
        this.processFlag = data.processFlag || 0;
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
        data.type = this.type;
        data.limitDir = this.limitDir;
        data.timeDomain = this.timeDomain;
        data.vehicle = this.vehicle;
        data.tollType = this.tollType;
        data.weather = this.weather;
        data.inputTime = this.inputTime;
        data.processFlag = this.processFlag;
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
        data.type = this.type;
        data.limitDir = this.limitDir;
        data.timeDomain = this.timeDomain;
        data.vehicle = this.vehicle;
        data.tollType = this.tollType;
        data.weather = this.weather;
        data.inputTime = this.inputTime;
        data.processFlag = this.processFlag;
        // boolBatch参数为了保证批量编辑操作；zxm修改
        if (boolBatch) {
            data.options = this.options;
        }
        return data;
    }
});

/** *
 * linkLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
FM.dataApi.rdLinkLimit = function (data, options) {
    return new FM.dataApi.RdLinkLimit(data, options);
};

