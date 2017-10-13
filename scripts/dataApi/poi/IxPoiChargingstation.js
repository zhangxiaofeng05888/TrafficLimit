/**
 * Created by liuyang on 2016/8/31.
 */
FM.dataApi.IxPoiChargingstation = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_POI_CHARGINGSTATION',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        // this.chargingId = data['chargingId'] || 0;
        this.pid = data.pid || 0;
        this.poiPid = data.poiPid || 0;
        this.audataId = data.audataId;
        this.chargingType = data.chargingType || 0; // 特殊需求，如果没有值，界面默认显示请选择
        this.changeBrands = data.changeBrands ? data.changeBrands.split('|') : [];
        var changeOpenTypeArr = data.changeOpenType ? data.changeOpenType.split('|') : [1];
        this.changeOpenType = {};
        for (var i = 0; i < changeOpenTypeArr.length; i++) {
            this.changeOpenType[changeOpenTypeArr[i]] = true;
        }
        this.chargingNum = data.chargingNum || 0;
        this.exchangeNum = data.exchangeNum;
        this.payment = data.payment;
        this.serviceProv = data.serviceProv || '0';
        this.memo = data.memo;
        this.photoName = data.photoName;
        this.openHour = data.openHour;
        this.parkingFees = data.parkingFees || 0;
        this.parkingInfo = data.parkingInfo;
        this.availableState = data.availableState || 0;
        this.rowId = data.rowId || null;
    },
    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.poiPid = this.poiPid;
        ret.audataId = this.audataId;
        ret.chargingType = this.chargingType;
        ret.changeBrands = this.changeBrands.join('|');
        var checkedChangeOpenTypeArr = [];
        for (var key in this.changeOpenType) {
            if (this.changeOpenType[key] == true) {
                checkedChangeOpenTypeArr.push(key);
            }
        }
        ret.changeOpenType = checkedChangeOpenTypeArr.join('|');
        ret.chargingNum = this.chargingNum;
        ret.exchangeNum = this.exchangeNum;
        ret.payment = this.payment;
        ret.serviceProv = this.serviceProv;
        ret.memo = this.memo;
        ret.photoName = this.photoName;
        ret.openHour = this.openHour;
        ret.parkingFees = parseInt(this.parkingFees, 10);
        ret.parkingInfo = this.parkingInfo;
        ret.availableState = this.availableState;
        ret.rowId = this.rowId;
        return ret;
    }
});
