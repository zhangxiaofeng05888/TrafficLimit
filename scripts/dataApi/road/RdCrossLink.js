/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdCrossLink = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDCROSSLINK';
        this.pid = data.pid;
        this.linkPid = data.linkPid;
        this.rowId = data.rowId || null;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        // data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdCrossLink = function (data, options) {
    return new FM.dataApi.RdCrossLink(data, options);
};
