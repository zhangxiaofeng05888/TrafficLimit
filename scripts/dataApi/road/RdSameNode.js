/**
 * Created by wuzhen on 2016/8/5.
 * Class RdSameNode 同一点
 */

FM.dataApi.RdSameNode = FM.dataApi.Feature.extend({
    /**
     * 设置信息
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDSAMENODE';
        this.pid = data.pid;
        this.groupId = data.groupId;
        this.rowId = data.rowId || null;

        this.parts = [];
        if (data.parts) {
            for (var i = 0, len = data.parts.length; i < len; i++) {
                this.parts.push(FM.dataApi.rdSameNodePart(data.parts[i]));
            }
        }
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.groupId = this.groupId;
        data.rowId = this.rowId;
        data.parts = [];
        for (var i = 0; i < this.parts.length; i++) {
            data.parts.push(this.parts[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.groupId = this.groupId;
        data.rowId = this.rowId;
        // data.geoLiveType = this.geoLiveType;
        data.parts = [];
        for (var i = 0; i < this.parts.length; i++) {
            data.parts.push(this.parts[i].getIntegrate());
        }
        return data;
    }
});

/** *
 * RdSameNode初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdSameNode}
 */
FM.dataApi.rdSameNode = function (data, options) {
    return new FM.dataApi.RdSameNode(data, options);
};

