/**
 * Created by liuzhe on 2016/7/27.
 */
FM.dataApi.CmgBuildFaceTopo = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.facePid = data.facePid;
        this.linkPid = data.linkPid;
        this.seqNum = data.seqNum;
        this.rowId = data.rowId || null;
    },

    getIntegrate: function () {
        var data = {};

        data.facePid = this.facePid;
        data.linkPid = this.linkPid;
        data.seqNum = this.seqNum;
        data.rowId = this.rowId;

        return data;
    },

    getSnapShot: function () {
        return this.getIntegrate();
    }
});

FM.dataApi.cmgBuildFaceTopo = function (data, options) {
    return new FM.dataApi.CmgBuildFaceTopo(data, options);
};
