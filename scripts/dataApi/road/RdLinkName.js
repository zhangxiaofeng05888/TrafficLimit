/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkName = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKNAME';
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
        this.nameGroupid = data.nameGroupid || 0;
        if (typeof data.seqNum !== 'undefined') {
            this.seqNum = data.seqNum;
        } else {
            this.seqNum = 1;
        }
        // this.seqNum = data.seqNum || 1;
        this.name = data.name || '';
        this.nameClass = data.nameClass || 1;
        this.inputTime = data.inputTime || '';
        this.nameType = data.nameType || 0;
        if (typeof data.srcFlag !== 'undefined') {
            this.srcFlag = data.srcFlag;
        } else {
            this.srcFlag = 9;
        }
        this.routeAtt = data.routeAtt || 0;
        this.code = data.code || 0;
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
        data.nameGroupid = this.nameGroupid;
        data.name = this.name;
        data.seqNum = this.seqNum;
        data.nameClass = parseInt(this.nameClass, 10);
        data.inputTime = this.inputTime;
        data.nameType = this.nameType;
        data.srcFlag = this.srcFlag;
        data.routeAtt = this.routeAtt;
        data.code = parseInt(this.code, 10);
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
        data.nameGroupid = this.nameGroupid;
        data.name = this.name;
        data.seqNum = this.seqNum;
        data.nameClass = parseInt(this.nameClass, 10);
        data.inputTime = this.inputTime;
        data.nameType = this.nameType;
        data.srcFlag = this.srcFlag;
        data.routeAtt = this.routeAtt;
        data.code = parseInt(this.code, 10);
        // boolBatch参数为了保证批量编辑操作；zxm修改
        if (boolBatch) {
            data.options = this.options;
        }

        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
FM.dataApi.rdLinkName = function (data, options) {
    return new FM.dataApi.RdLinkName(data, options);
};

