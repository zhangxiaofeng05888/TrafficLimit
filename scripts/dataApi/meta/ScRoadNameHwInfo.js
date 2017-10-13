/**
 * Created by mali on 2017/4/20.
 */
FM.dataApi.ScRoadNameHwInfo = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'SCROADNAMEHWINFO';
        this.pid = data.pid || null;
        this.hwPidUp = data.hwPidUp || null;
        this.hwPidDw = data.hwPidDw || null;
        this.nameGroupid = data.nameGroupid || '';
        this.memo = data.memo || '';
        this.uRecord = data.uRecord || 0;
        this.uFields = data.uFields || '';
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路名信息
     */
    getIntegrate: function () {
        var data = {};
        data.hwPidUp = this.hwPidUp;
        data.hwPidDw = this.hwPidDw;
        data.nameGroupid = this.nameGroupid;
        data.memo = this.memo;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.hwPidUp = this.hwPidUp;
        data.hwPidDw = this.hwPidDw;
        data.nameGroupid = this.nameGroupid;
        data.memo = this.memo;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        return data;
    }

});

FM.dataApi.scRoadNameHwInfo = function (data, options) {
    return new FM.dataApi.ScRoadNameHwInfo(data, options);
};
