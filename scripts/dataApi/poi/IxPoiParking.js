/**
 * Created by mali on 2016/6/6.
 */

FM.dataApi.IxPoiParking = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_POI_PARKING',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        // this._flag_ = data._flag_ || false; // 深度信息特殊字段,用于控制深度信息的保存
        this.pid = data.pid || 0;
        this.parkingType = data.parkingType;
        var tollStdArr = data.tollStd ? data.tollStd.split('|') : [];
        this.tollStd = {};
        for (var i = 0; i < tollStdArr.length; i++) {
            this.tollStd[tollStdArr[i]] = true;
        }
        this.tollDes = data.tollDes;
        var tollWayArr = data.tollWay ? data.tollWay.split('|') : [];
        this.tollWay = {};
        for (var j = 0; j < tollWayArr.length; j++) {
            this.tollWay[tollWayArr[j]] = true;
        }

        var paymentArr = data.payment ? data.payment.split('|') : [];
        this.payment = {};
        for (var p = 0; p < paymentArr.length; p++) {
            this.payment[paymentArr[p]] = true;
        }

        var remarkArr = data.remark ? data.remark.split('|') : [];
        this.remark = {};
        for (var q = 0; q < remarkArr.length; q++) {
            this.remark[remarkArr[q]] = true;
        }
        this.source = data.source;
        this.openTiime = data.openTiime;
        this.totalNum = data.totalNum || 0;
        this.workTime = data.workTime;
        this.resHigh = data.resHigh || 0;
        this.resWidth = data.resWidth || 0;
        this.resWeigh = data.resWeigh || 0;
        this.certificate = data.certificate || 0;
        this.vehicle = data.vehicle || 0;
        this.photoName = data.photoName;
        this.rowId = data.rowId || null;
    },
    getIntegrate: function () {
        var ret = {};
        // ret._flag_ = this._flag_;
        ret.pid = this.pid;
        ret.parkingType = this.parkingType;
        var checkedTollStdArr = [];
        for (var k in this.tollStd) {
            if (this.tollStd[k] == true) {
                checkedTollStdArr.push(k);
            }
        }
        ret.tollStd = checkedTollStdArr.join('|');
        ret.tollDes = this.tollDes;
        var checkedTollWayArr = [];
        for (var p in this.tollWay) {
            if (this.tollWay[p] == true) {
                checkedTollWayArr.push(p);
            }
        }
        ret.tollWay = checkedTollWayArr.join('|');
        var checkedPayment = [];
        for (var q in this.payment) {
            if (this.payment[q]) {
                checkedPayment.push(q);
            }
        }
        ret.payment = checkedPayment.join('|');

        var checkedRemark = [];
        for (var r in this.remark) {
            if (this.remark[r]) {
                checkedRemark.push(r);
            }
        }
        ret.remark = checkedRemark.join('|');
        ret.source = this.source;
        ret.openTiime = this.openTiime;
        ret.totalNum = this.totalNum;
        ret.workTime = this.workTime;
        ret.resHigh = this.resHigh;
        ret.resWidth = this.resWidth;
        ret.resWeigh = this.resWeigh;
        ret.certificate = this.certificate;
        ret.vehicle = this.vehicle;
        ret.photoName = this.photoName;
        ret.rowId = this.rowId;
        return ret;
    }
});
