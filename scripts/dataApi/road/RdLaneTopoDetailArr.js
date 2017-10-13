/**
 * Created by liuyang on 2016/11/25.
 * Class RdLaneTopoDetailArr
 */

FM.dataApi.RdLaneTopoDetailArr = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLANETOPODETAILARR';
        this.laneTopoInfos = [];
        if (data.laneTopoInfos && data.laneTopoInfos.length > 0) {
            for (var i = 0; i < data.laneTopoInfos.length; i++) {
                var laneTopoInfos = FM.dataApi.rdLaneTopoDetail(data.laneTopoInfos[i]);
                this.laneTopoInfos.push(laneTopoInfos);
            }
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdLaneTopoDetail简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.laneTopoInfos = [];
        for (var i = 0; i < this.laneTopoInfos.length; i++) {
            data.laneTopoInfos.push(this.laneTopoInfos[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdLaneTopoDetail详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.laneTopoInfos = [];
        for (var i = 0; i < this.laneTopoInfos.length; i++) {
            data.laneTopoInfos.push(this.laneTopoInfos[i].getIntegrate());
        }
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * RdLaneTopoDetail初始化函数
 * @param data
 * @param options 其他可选参数
 * @returns {.dataApi.RdLaneTopoDetail}
 */
FM.dataApi.rdLaneTopoDetailArr = function (data, options) {
    return new FM.dataApi.RdLaneTopoDetailArr(data, options);
};
