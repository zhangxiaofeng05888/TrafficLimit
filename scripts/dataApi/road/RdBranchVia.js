/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchVia = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHVIA';
        this.rowId = data.rowId || null;
        this.groupId = data.groupId || 1;
        this.linkPid = data.linkPid;
        this.seqNum = data.seqNum || 1;
    },

    getSnapShot: function () {
        var data = {};
        data.rowId = this.rowId;
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdBranchVia = function (data, options) {
    return new FM.dataApi.RdBranchVia(data, options);
};
