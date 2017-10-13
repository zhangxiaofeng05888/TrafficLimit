/**
 * Created by liuyang on 2016/7/29.
 * Class RdSlope
 */

FM.dataApi.RdSlope = FM.dataApi.Feature.extend({

    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDSLOPE';
        this.pid = data.pid || '';
        this.nodePid = data.nodePid || 0;
        this.linkPid = data.linkPid;
        // this.type = data.type || 1;
        if (typeof data.type !== 'undefined') {
            this.type = data.type;
        } else {
            this.type = 1;
        }
        this.angle = data.angle || 0;
        this.slopeVias = [];

        for (var i = 0; i < data.slopeVias.length; i++) {
            var link = FM.dataApi.rdSlopeLinks(data.slopeVias[i]);
            this.slopeVias.push(link);
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdElectronicEye简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.nodePid = this.nodePid;
        data.linkPid = this.linkPid;
        data.type = this.type;
        data.angle = this.angle;
        data.slopeVias = [];
        data.geoLiveType = this.geoLiveType;
        for (var i = 0; i < this.slopeVias.length; i++) {
            data.slopeVias.push(this.slopeVias[i].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdElectronicEye详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.nodePid = this.nodePid;
        data.linkPid = this.linkPid;
        data.type = this.type;
        data.angle = this.angle;
        data.slopeVias = [];
        data.geoLiveType = this.geoLiveType;
        for (var i = 0; i < this.slopeVias.length; i++) {
            data.slopeVias.push(this.slopeVias[i].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 重写了DataModel.js的方法，取消掉了linkPid属性，因为坡度如果没有修改linkPid的时候是不需要传递linkPid的，但是DataModel.js中却包含了linkPid
     */
    getChanges: function (boolBatch) {
        var chages = this._compareJson(this.getIntegrate(boolBatch), this._originalJson);
        if (this.linkPid && this.linkPid === this._originalJson.linkPid && chages) {
            delete chages.linkPid;
        }
        return chages;
    }
});

/** *
 * RdSlope初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdSlope = function (data, options) {
    return new FM.dataApi.RdSlope(data, options);
};

