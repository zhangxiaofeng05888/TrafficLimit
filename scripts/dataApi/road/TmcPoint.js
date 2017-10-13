/**
 * Created by wangmingdong on 2016/11/10.
 */
FM.dataApi.TMCPoint = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TMCPOINT';
        this.tmcId = data.tmcId;
        this.loctableId = data.loctableId;
        this.cid = data.cid;
        this.pid = data.tmcId;
        this.locCode = data.locCode;
        this.typeCode = data.typeCode;
        this.inPos = data.inPos;
        this.inNeg = data.inNeg;
        this.outNeg = data.outNeg;
        this.outPos = data.outPos;
        this.presentPos = data.presentPos;
        this.presentNeg = data.presentNeg;
        this.locoffPos = data.locoffPos;
        this.locoffNeg = data.locoffNeg;
        this.lineTmcId = data.lineTmcId;
        this.areaTmcId = data.areaTmcId;
        this.juncLoccode = data.juncLoccode;
        this.neighbourBound = data.neighbourBound;
        this.neighbourTable = data.neighbourTable;
        this.urban = data.urban;
        this.interuptRoad = data.interuptRoad;
        // 服务返回的是坐标数组，这里需要转成几何格式
        if (data.geometry.length) {
            var coor = data.geometry;
            this.geometry = {
                coordinates: coor,
                type: 'Point'
            };
        } else {
            this.geometry = data.geometry;
        }
        this.editFlag = data.editFlag;
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0; i < data.names.length; i++) {
                var name = FM.dataApi.tmcPointName(data.names[i]);
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
        data.inPos = this.inPos;
        data.inNeg = this.inNeg;
        data.outNeg = this.outNeg;
        data.outPos = this.outPos;
        data.presentPos = this.presentPos;
        data.presentNeg = this.presentNeg;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.lineTmcId = this.lineTmcId;
        data.areaTmcId = this.areaTmcId;
        data.juncLoccode = this.juncLoccode;
        data.neighbourBound = this.neighbourBound;
        data.neighbourTable = this.neighbourTable;
        data.urban = this.urban;
        data.interuptRoad = this.interuptRoad;
        data.geometry = this.geometry;
        data.editFlag = this.editFlag;
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
        data.inPos = this.inPos;
        data.inNeg = this.inNeg;
        data.outNeg = this.outNeg;
        data.outPos = this.outPos;
        data.presentPos = this.presentPos;
        data.presentNeg = this.presentNeg;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.lineTmcId = this.lineTmcId;
        data.areaTmcId = this.areaTmcId;
        data.juncLoccode = this.juncLoccode;
        data.neighbourBound = this.neighbourBound;
        data.neighbourTable = this.neighbourTable;
        data.urban = this.urban;
        data.interuptRoad = this.interuptRoad;
        data.geometry = this.geometry;
        data.editFlag = this.editFlag;
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

FM.dataApi.tmcPoint = function (data, options) {
    return new FM.dataApi.TMCPoint(data, options);
};

