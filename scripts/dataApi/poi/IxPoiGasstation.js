/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiGasstation = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_POI_GASSTATION',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        // this._flag_ = data._flag_ || false; // 深度信息特殊字段,用于控制深度信息的保存
        this.poiPid = data.poiPid;
        this.serviceProv = data.serviceProv;
        var fuelTypeArr = data.fuelType ? data.fuelType.split('|') : [];
        this.fuelType = {};
        for (var i = 0; i < fuelTypeArr.length; i++) {
            this.fuelType[fuelTypeArr[i]] = true;
        }
        var oilTypeArr = data.oilType ? data.oilType.split('|') : [];
        this.oilType = {};
        for (var j = 0; j < oilTypeArr.length; j++) {
            this.oilType[oilTypeArr[j]] = true;
        }
        var egTypeArr = data.egType ? data.egType.split('|') : [];
        this.egType = {};
        for (var h = 0; h < egTypeArr.length; h++) {
            this.egType[egTypeArr[h]] = true;
        }
        var mgTypeArr = data.mgType ? data.mgType.split('|') : [];
        this.mgType = {};
        for (var k = 0; k < mgTypeArr.length; k++) {
            this.mgType[mgTypeArr[k]] = true;
        }

        var paymentArr = data.payment ? data.payment.split('|') : [];
        this.payment = {};
        for (var l = 0; l < paymentArr.length; l++) {
            this.payment[paymentArr[l]] = true;
        }
        var serviceArr = data.service ? data.service.split('|') : [];
        this.service = {};
        for (var p = 0; p < serviceArr.length; p++) {
            this.service[serviceArr[p]] = true;
        }
        this.memo = data.memo;
        this.openHour = data.openHour;
        this.photoName = data.photoName;
        this.rowId = data.rowId || null;
    },
    getIntegrate: function () {
        var ret = {};
        // ret._flag_ = this._flag_;
        ret.pid = this.pid;
        ret.poiPid = this.poiPid;
        ret.serviceProv = this.serviceProv;
        var checkedFuelTypeArr = [];
        for (var k in this.fuelType) {
            if (this.fuelType[k]) {
                checkedFuelTypeArr.push(k);
            }
        }
        ret.fuelType = checkedFuelTypeArr.join('|');
        var checkedOilTypeArr = [];
        for (var i in this.oilType) {
            if (this.oilType[i]) {
                checkedOilTypeArr.push(i);
            }
        }
        ret.oilType = checkedOilTypeArr.join('|');
        var checkedEgTypeArr = [];
        for (var j in this.egType) {
            if (this.egType[j]) {
                checkedEgTypeArr.push(j);
            }
        }
        ret.egType = checkedEgTypeArr.join('|');
        var checkedMgTypeArr = [];
        for (var o in this.mgType) {
            if (this.mgType[o]) {
                checkedMgTypeArr.push(o);
            }
        }
        ret.mgType = checkedMgTypeArr.join('|');
        var checkedPaymentArr = [];
        for (var p in this.payment) {
            if (this.payment[p]) {
                checkedPaymentArr.push(p);
            }
        }
        ret.payment = checkedPaymentArr.join('|');
        var checkedServiceArr = [];
        for (var r in this.service) {
            if (this.service[r]) {
                checkedServiceArr.push(r);
            }
        }
        ret.service = checkedServiceArr.join('|');
        ret.memo = this.memo;
        ret.openHour = this.openHour;
        if (ret.openHour) {
            ret.openHour = FM.Util.ToDBC(ret.openHour);
        }
        ret.photoName = this.photoName;
        ret.rowId = this.rowId;
        return ret;
    }
});
