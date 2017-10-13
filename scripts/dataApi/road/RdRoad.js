/**
 * Created by liuyang on 2016/8/9.
 * Class RdRoad
 */

FM.dataApi.RdRoad = FM.dataApi.Feature.extend({
    /**
     *
     * @param data
     * @param options 其他可选参数
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDROAD';
        this.pid = data.pid || '';
        this.links = [];

        for (var i = 0; i < data.links.length; i++) {
            var link = FM.dataApi.rdRoadLinks(data.links[i]);
            this.links.push(link);
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdRoad简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.nodes = [];
        data.links = [];
        data.geoLiveType = this.geoLiveType;
        for (var i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }

        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取rdRoad详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.nodes = [];
        data.links = [];
        data.geoLiveType = this.geoLiveType;
        for (var i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * rdRoad初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdRoad}
 */
FM.dataApi.rdRoad = function (data, options) {
    return new FM.dataApi.RdRoad(data, options);
};

