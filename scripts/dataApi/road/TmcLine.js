/**
 * Created by wangmingdong on 2016/11/21.
 */
FM.dataApi.TMCLine = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TMCLINE';
        this.tmcId = data.tmcId;
        this.pid = data.tmcId;
        this.loctableId = data.loctableId;
        this.cid = data.cid;
        this.locCode = data.locCode;
        this.typeCode = data.typeCode;
        this.seqNum = data.seqNum;
        this.areaTmcId = data.areaTmcId;
        this.locoffPos = data.locoffPos;
        this.locoffNeg = data.locoffNeg;
        this.uplineTmcId = data.uplineTmcId;
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0; i < data.names.length; i++) {
                var name = FM.dataApi.tmcLineName(data.names[i]);
                this.names.push(name);
            }
        }
        this.uRecord = data.uRecord;
        this.uFields = data.uFields;
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.cid = this.cid;
        data.locCode = this.locCode;
        data.typeCode = this.typeCode;
        data.seqNum = this.seqNum;
        data.areaTmcId = this.areaTmcId;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.uplineTmcId = this.uplineTmcId;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.cid = this.cid;
        data.locCode = this.locCode;
        data.typeCode = this.typeCode;
        data.seqNum = this.seqNum;
        data.areaTmcId = this.areaTmcId;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.uplineTmcId = this.uplineTmcId;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }

});

FM.dataApi.tmcLine = function (data, options) {
    return new FM.dataApi.TMCLine(data, options);
};

