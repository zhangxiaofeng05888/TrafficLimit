/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdCrossNode = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDCROSSNODE';
        this.pid = data.pid;
        this.isMain = data.isMain || 0;
        this.nodePid = data.nodePid;
        this.rowId = data.rowId || null;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.isMain = this.isMain;
        data.nodePid = this.nodePid;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.isMain = this.isMain;
        data.nodePid = this.nodePid;
        data.rowId = this.rowId;
       // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdCrossNode = function (data, options) {
    return new FM.dataApi.RdCrossNode(data, options);
};
