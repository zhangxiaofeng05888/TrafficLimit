/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdLaneVIA = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLANEVIA';
        this.rowId = data.rowId || null;
        this.groupId = data.groupId || 1;
        this.linkPid = data.linkPid;
        this.seqNum = data.seqNum || 1;
        this.topologyId = data.topologyId || 0;
    },

    getSnapShot: function () {
        var data = {};
        data.rowId = this.rowId;
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.topologyId = this.topologyId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.topologyId = this.topologyId;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdLaneVIA = function (data, options) {
    return new FM.dataApi.RdLaneVIA(data, options);
};
