/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdLinkWalkStair = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKWALKSTAIR';
        if (!data.linkPid) {
            throw new Error('form对象没有对应link');
        }
        if (data.options) {
            this.options = data.options;
        }
        this.linkPid = data.linkPid || '';
        this.rowId = data.rowId || null;
        this.stairLoc = data.stairLoc || 0;
        this.stairFlag = data.stairFlag || 0;
        this.workDir = data.workDir || 0;
        this.captureFlag = data.captureFlag || 0;
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
        data.stairLoc = this.stairLoc;
        data.stairFlag = this.stairFlag;
        data.workDir = this.workDir;
        data.captureFlag = this.captureFlag;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
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
        data.stairLoc = this.stairLoc;
        data.stairFlag = this.stairFlag;
        data.workDir = this.workDir;
        data.captureFlag = this.captureFlag;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
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
FM.dataApi.rdLinkWalkStair = function (data, options) {
    return new FM.dataApi.RdLinkWalkStair(data, options);
};

