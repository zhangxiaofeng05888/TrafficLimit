/**
 * Created by linglong on 2016/8/11.
 */
FM.dataApi.LcLinkKind = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'LCLINKKIND';
        this.linkPid = data.linkPid;
        this.kind = data.kind || 0;
        this.form = data.form || 0;
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.kind = this.kind;
        data.form = this.form;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.lcLinkKind = function (data, options) {
    return new FM.dataApi.LcLinkKind(data, options);
};

