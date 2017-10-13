/**
 * Created by mali on 2017/5/22.
 */
FM.dataApi.CmgBuildingPoi = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'CMGBUILDINGPOI';
        this.buildingPid = data.buildingPid;
        this.poiPid = data.poiPid;
    },

    /*
     *建筑物与POI关系表
     */
    getIntegrate: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        data.poiPid = this.poiPid;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        data.poiPid = this.poiPid;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.cmgBuildingPoi = function (data, options) {
    return new FM.dataApi.CmgBuildingPoi(data, options);
};
