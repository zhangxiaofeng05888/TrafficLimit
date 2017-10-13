/**
 * Created by liuyang on 2016/11/14.
 */
FM.dataApi.RdLaneTopoVia = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLANETOPOVIA';
        this.rowId = data.rowId || null;
        this.topoId = data.topoId;
        this.lanePid = data.lanePid || 0;
        this.viaLinkPid = data.viaLinkPid || 1;
        this.groupId = data.groupId || 1;
        this.seqNum = data.seqNum || 1;
    },

    getSnapShot: function () {
        var data = {};
        data.rowId = this.rowId;
        data.topoId = this.topoId;
        data.lanePid = this.lanePid;
        data.viaLinkPid = this.viaLinkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.topoId = this.topoId;
        data.lanePid = this.lanePid;
        data.viaLinkPid = this.viaLinkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdLaneTopoVia = function (data, options) {
    return new FM.dataApi.RdLaneTopoVia(data, options);
};
