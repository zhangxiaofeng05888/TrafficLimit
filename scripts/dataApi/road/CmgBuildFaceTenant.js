/**
 * Created by liuzhe on 2016/7/27.
 */
FM.dataApi.CmgBuildFaceTenant = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.facePid = data.facePid;
        this.poiPid = data.poiPid;
        this.flag = data.flag;
        this.tel = data.tel;
        this.x = data.x;
        this.y = data.y;
        this.name = data.name || '';
        this.floor = data.floor;
        this.srcFlag = data.srcFlag || 0;
    },

    getIntegrate: function () {
        var data = {};

        data.facePid = this.facePid;
        data.poiPid = this.poiPid;
        data.flag = this.flag;
        data.tel = this.tel;
        data.x = this.x;
        data.y = this.y;
        data.name = this.name;
        data.floor = this.floor;
        data.srcFlag = this.srcFlag;
        data.rowId = this.rowId;

        return data;
    },

    getSnapShot: function () {
        return this.getIntegrate();
    }
});

FM.dataApi.cmgBuildFaceTenant = function (data, options) {
    return new FM.dataApi.CmgBuildFaceTenant(data, options);
};
