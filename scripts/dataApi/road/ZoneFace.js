/**
 * Created by liuyang on 2016/6/29.
 */
FM.dataApi.ZoneFace = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ZONEFACE';
        this.pid = data.pid;
        this.regionId = data.regionId;
        this.geometry = data.geometry;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.meshId = data.meshId || 0;
        this.rowId = data.rowId || null;
        this.faceTopos = data.faceTopos || [];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.regionId = this.regionId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.faceTopos = this.faceTopos;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.facePid = this.facePid;
        data.regionId = this.regionId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.faceTopos = this.faceTopos;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.zoneFace = function (data, options) {
    return new FM.dataApi.ZoneFace(data, options);
};

