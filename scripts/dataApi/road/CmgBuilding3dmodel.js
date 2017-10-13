/**
 * Created by mali on 2017/5/22.
 */
FM.dataApi.CmgBuilding3dmodel = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'CMGBUILDING3DMODEL';
        this.buildingPid = data.buildingPid;
        // this.modelId = data.modelId;
        this.pid = data.pid;
        this.resolution = data.resolution || 0;
        this.modelName = data.modelName || '';
        this.materialName = data.materialName || '';
        this.textureName = data.textureName || '';
        this.rowId = data.rowId || '';
    },

    /*
     *建筑物的3DLandMark 模型表
     */
    getIntegrate: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        // data.modelId = this.modelId;
        data.pid = this.pid;
        data.resolution = this.resolution;
        data.modelName = this.modelName;
        data.materialName = this.materialName;
        data.textureName = this.textureName;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        // data.modelId = this.modelId;
        data.pid = this.pid;
        data.resolution = this.resolution;
        data.modelName = this.modelName;
        data.materialName = this.materialName;
        data.textureName = this.textureName;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.cmgBuilding3dmodel = function (data, options) {
    return new FM.dataApi.CmgBuilding3dmodel(data, options);
};
