/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchSignAsreal = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHSIGNASREAL';
        this.pid = data.pid;
        this.rowId = data.rowId || null;
        this.branchPid = data.branchPid;
        this.arrowCode = data.arrowCode || '';
        this.memo = data.memo || '';
        this.svgfileCode = data.svgfileCode || '';
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.arrowCode = this.arrowCode;
        data.memo = this.memo;
        data.svgfileCode = this.svgfileCode;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.branchPid = this.branchPid;
        data.arrowCode = this.arrowCode;
        data.memo = this.memo;
        data.svgfileCode = this.svgfileCode;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

FM.dataApi.rdBranchSignAsreal = function (data, options) {
    return new FM.dataApi.RdBranchSignAsreal(data, options);
};
