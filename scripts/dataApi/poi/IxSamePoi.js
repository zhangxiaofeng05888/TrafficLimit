/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.IxSamepoi = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_SAMEPOI',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.relationType = data.relationType || 1;
        this.rowId = data.rowId || null;
    },
    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.relationType = this.relationType;
        ret.rowId = this.rowId;
        return ret;
    }
});
