/**
 * Created by wangmingdong on 2016/8/31.
 * Class Rdnode
 */

FM.dataApi.RdLaneCondition = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLANECONDITION';
        this.lanePid = data.lanePid;
        this.direction = data.direction || 1;
        this.directionTime = data.directionTime || null;
        this.vehicle = data.vehicle || 0;
        this.vehicleTime = data.vehicleTime || null;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdLaneCondition简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.lanePid = this.lanePid;
        data.direction = parseInt(this.direction, 10);
        data.directionTime = this.directionTime;
        data.vehicle = this.vehicle;
        data.vehicleTime = this.vehicleTime;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdLaneCondition详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.lanePid = this.lanePid;
        data.direction = parseInt(this.direction, 10);
        data.directionTime = this.directionTime;
        data.vehicle = this.vehicle;
        data.vehicleTime = this.vehicleTime;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * RdLaneCondition初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdLaneCondition = function (data, options) {
    return new FM.dataApi.RdLaneCondition(data, options);
};
