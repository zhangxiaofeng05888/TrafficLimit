/**
 * Created by liuyang on 2016/6/29.
 */
FM.dataApi.ZoneLinkKind = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ZONELINKKIND';
        this.rowId = data.rowId || null;
        this.linkPid = data.linkPid;
        if (typeof data.kind !== 'undefined') {
            this.kind = data.kind;
        } else {
            this.kind = 1;
        }
        if (typeof data.form !== 'undefined') {
            this.form = data.form;
        } else {
            this.form = 1;
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.linkPid = this.linkPid;
        data.kind = this.kind;
        data.form = this.form;
        return data;
    }

});

FM.dataApi.zoneLinkKind = function (data, options) {
    return new FM.dataApi.ZoneLinkKind(data, options);
};

