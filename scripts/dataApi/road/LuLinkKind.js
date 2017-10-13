/**
 * Created by mali on 2016/7/25.
 */
FM.dataApi.LuLinkKind = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'LULINKKIND';
        this.linkPid = data.linkPid;
        this.rowId = data.rowId || null;
        this.kind = data.kind || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.kind = this.kind;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.luLinkKind = function (data, options) {
    return new FM.dataApi.LuLinkKind(data, options);
};

