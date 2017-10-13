/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchRealImage = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHREALIMAGE';
        this.branchPid = data.branchPid;
        this.imageType = data.imageType || 0;
        this.realCode = data.realCode || '';
        this.arrowCode = data.arrowCode || '';
        this.rowId = data.rowId || null;
    },

    getIntegrate: function () {
        var data = {};
        data.branchPid = this.pid;
        data.imageType = this.imageType;
        data.realCode = this.realCode;
        data.arrowCode = this.arrowCode;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.branchPid = this.pid;
        data.imageType = this.imageType;
        data.realCode = this.realCode;
        data.arrowCode = this.arrowCode;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});
