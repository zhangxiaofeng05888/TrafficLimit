/**
 * Created by mali on 2017/5/22.
 */
FM.dataApi.CmgBuilding3dicon = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'CMGBUILDING3DICON';
        this.buildingPid = data.buildingPid;
        this.width = data.width || 64;
        this.height = data.height || 64;
        this.iconName = data.iconName;
        this.alphaName = data.alphaName;
        this.rowId = data.rowId || '';
    },

    /*
     *建筑物的3DLandMark 图标表
     */
    getIntegrate: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        data.width = this.width;
        data.height = this.height;
        data.iconName = this.iconName;
        data.alphaName = this.alphaName;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        data.width = this.width;
        data.height = this.height;
        data.iconName = this.iconName;
        data.alphaName = this.alphaName;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.cmgBuilding3dicon = function (data, options) {
    return new FM.dataApi.CmgBuilding3dicon(data, options);
};
