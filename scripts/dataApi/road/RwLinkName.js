/**
 * Created by zhaohang on 2016/4/7.
 */
FM.dataApi.RwLinkName = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RWLINKNAME';
        this.rowId = data.rowId || null;
        this.pid = data.pid;
        this.linkPid = data.linkPid || 0;
        this.nameGroupid = data.nameGroupid || 0;
        this.name = data.name || '';
        // this.uFields = data["uFields"];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.nameGroupid = this.nameGroupid;
        // data["uFields"] = this.uFields;
        // data["name"] = this.name;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.rowId = this.rowId;
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.nameGroupid = this.nameGroupid;
        data.geoLiveType = this.geoLiveType;
        // data["uFields"] = this.uFields;
        // data["name"] = this.name;
        return data;
    }

});

FM.dataApi.rwLinkName = function (data, options) {
    return new FM.dataApi.RwLinkName(data, options);
};

