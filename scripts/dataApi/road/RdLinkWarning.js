/**
 * Created by wangmingdong on 2017/8/22.
 * Class Rdnode
 */

FM.dataApi.RdLinkWarning = FM.dataApi.Feature.extend({
    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDLINKWARNING';
        this.pid = data.pid || null;
        this.linkPid = data.linkPid;
        this.direct = data.direct || 0;
        this.geometry = data.geometry;
        this.typeCode = data.typeCode || null;
        this.validDis = data.validDis || 0;
        this.warnDis = data.warnDis || 0;
        this.timeDomain = data.timeDomain || '';
        this.vehicle = data.vehicle || 0;
        this.descript = data.descript || null;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取道路简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.direct = this.direct;
        data.geometry = this.geometry;
        data.typeCode = this.typeCode;
        data.validDis = this.validDis;
        data.warnDis = this.warnDis;
        data.timeDomain = this.timeDomain;
        data.vehicle = this.vehicle;
        data.descript = this.descript;
        data.rowId = this.rowId;
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
        data.linkPid = this.linkPid;
        data.direct = this.direct;
        data.geometry = this.geometry;
        data.typeCode = this.typeCode;
        data.validDis = this.validDis;
        data.warnDis = this.warnDis;
        data.timeDomain = this.timeDomain;
        data.vehicle = this.vehicle;
        data.descript = this.descript;
       // data.geoLiveType = this.geoLiveType;

        return data;
    }
});

/** *
 * RdLinkWarning
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdLinkWarning = function (data, options) {
    return new FM.dataApi.RdLinkWarning(data, options);
};

