/**
 * Created by wuzhen on 2016/8/15.
 * Class RdVoiceGuideVia 语音引导经过线表
 */

FM.dataApi.RdVoiceGuideVia = FM.dataApi.Feature.extend({

    /**
     * 设置信息
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDVOICEGUIDEVIA';
        this.detailId = data.detailId;
        this.linkPid = data.linkPid;
        this.groupId = (data.groupId === undefined || data.groupId === '') ? 1 : data.groupId;
        this.seqNum = (data.seqNum === undefined || data.seqNum === '') ? 1 : data.seqNum;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.detailId = this.detailId;
        data.linkPid = this.linkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 全量信息
     */
    getIntegrate: function () {
        var data = {};
        data.detailId = this.detailId;
        data.linkPid = this.linkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * 初始化函数
 * 其他可选参数
 * @returns {.dataApi.RdVoiceGuideVia}
 */
FM.dataApi.rdVoiceGuideVia = function (data, options) {
    return new FM.dataApi.RdVoiceGuideVia(data, options);
};

