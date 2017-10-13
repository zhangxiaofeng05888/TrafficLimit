/**
 * Created by wangmingdong on 2016/11/22.
 */
FM.dataApi.RdTmcLocationLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDTMCLOCATIONLINK';
        this.groupId = data.groupId;
        this.linkPid = data.linkPid;
        this.locDirect = data.locDirect || 0;
        this.rowId = data.rowId || null;
        this.direct = data.direct || 0;
        this.geometry = data.geometry || null;
        this.sNodePid = data.sNodePid || 0;
        this.eNodePid = data.eNodePid || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.locDirect = this.locDirect;
        data.rowId = this.rowId;
        data.direct = this.direct;
        data.geometry = this.geometry;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.locDirect = this.locDirect;
        data.rowId = this.rowId;
        data.direct = this.direct;
        data.geometry = this.geometry;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        return data;
    }

});

FM.dataApi.rdTmcLocationLink = function (data, options) {
    return new FM.dataApi.RdTmcLocationLink(data, options);
};

