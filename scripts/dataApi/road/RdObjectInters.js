/**
 * Created by liuyang on 2016/8/24.
 * Class RdObject组成node
 */

FM.dataApi.RdObjectInters = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDOBJECTINTERS';
        this.interPid = data.interPid;
        this.links = [];
        this.nodes = [];
        for (var i = 0; i < data.links.length; i++) {
            var link = FM.dataApi.rdInterLinks(data.links[i]);
            this.links.push(link);
        }
        for (var j = 0; j < data.nodes.length; j++) {
            var node = FM.dataApi.rdInterNodes(data.nodes[j]);
            this.nodes.push(node);
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取组成node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.interPid = this.interPid;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取组成node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.interPid = this.interPid;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * rdInterNodes初始化函数
 * @param id
 * @param point 初始化rdInterNodes的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdObjectInters = function (data, options) {
    return new FM.dataApi.RdObjectInters(data, options);
};

