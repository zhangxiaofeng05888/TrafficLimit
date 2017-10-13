/**
 * Created by liuyang on 2016/8/31.
 */
FM.dataApi.IxPoiChargingplot = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_POI_CHARGINGPLOT',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        var openTypeArr,
            plugTypeArr,
            i;
        this.poiPid = data.poiPid || 0;
        this.groupId = data.groupId || 0; // 服务在批处理时对于新增的数据groupId等于1时会存在问题，所以改成0
        this.count = data.count || 1;
        this.acdc = data.acdc || 0;
        plugTypeArr = data.plugType ? data.plugType.split('|') : ['9'];
        this.plugType = {};
        for (i = 0; i < plugTypeArr.length; i++) {
            this.plugType[plugTypeArr[i]] = true;
        }
        this.power = data.power || '';
        this.voltage = data.voltage || '';
        this.current = data.current || '';
        this.mode = data.mode || 0;
        this.memo = data.memo;
        this.plugNum = data.plugNum || 1;
        this.prices = data.prices || '';
        openTypeArr = data.openType ? data.openType.split('|') : ['1'];
        this.openType = {};
        this.selectedChain = '';
        this.isBrandOpen = false;
        for (i = 0; i < openTypeArr.length; i++) {
            if (openTypeArr[i].length === 4) { // 品牌的编码长度是4位
                this.selectedChain = openTypeArr[i];
                this.isBrandOpen = true;
            } else {
                this.openType[openTypeArr[i]] = true;
            }
        }
        this.availableState = data.availableState || 0;
        this.manufacturer = data.manufacturer || '';
        this.factoryNum = data.factoryNum || '';
        this.plotNum = data.plotNum || '';
        this.productNum = data.productNum || '';
        this.parkingNum = data.parkingNum || '';
        this.floor = data.floor || 1;
        this.locationType = data.locationType || 0;
        var paymentArr = data.payment ? data.payment.split('|') : ['4'];
        this.payment = {};

        for (i = 0; i < paymentArr.length; i++) {
            this.payment[paymentArr[i]] = true;
        }
        this.rowId = data.rowId || null;
    },
    getIntegrate: function () {
        var ret = {};
        var key;
        this.toCDB(); // 部分属性转半角
        ret.groupId = this.groupId;
        ret.poiPid = this.poiPid;
        ret.count = this.count;
        ret.acdc = parseInt(this.acdc, 10);
        var plugTypeArr = [];
        for (key in this.plugType) {
            if (this.plugType[key] == true) {
                plugTypeArr.push(key);
            }
        }
        ret.plugType = plugTypeArr.join('|');
        ret.power = this.power;
        ret.voltage = this.voltage;
        ret.current = this.current;
        ret.mode = parseInt(this.mode, 10);
        ret.memo = this.memo;
        ret.plugNum = this.plugNum;
        ret.prices = this.prices;
        var openTypeArr = [];
        for (key in this.openType) {
            if (this.openType[key] === true) {
                openTypeArr.push(key);
            }
        }
        if (this.isBrandOpen && this.selectedChain) {
            openTypeArr.push(this.selectedChain);
        }
        ret.openType = openTypeArr.join('|');
        if (ret.openType === '') {
            ret.openType = '1';
        }
        ret.availableState = parseInt(this.availableState, 10);
        ret.manufacturer = this.manufacturer;
        ret.factoryNum = this.factoryNum;
        ret.plotNum = this.plotNum;

        ret.productNum = this.productNum;
        ret.parkingNum = this.parkingNum;
        ret.floor = this.floor || 1;
        ret.locationType = parseInt(this.locationType, 10);
        var paymentArr = [];
        for (key in this.payment) {
            if (this.payment[key] == true) {
                paymentArr.push(key);
            }
        }
        ret.payment = paymentArr.join('|');
        ret.rowId = this.rowId;
        return ret;
    },

    toCDB: function () {
        if (this.power) {
            this.power = FM.Util.ToCDB(this.power);
        }
        if (this.voltage) {
            this.voltage = FM.Util.ToCDB(this.voltage);
        }
        if (this.current) {
            this.current = FM.Util.ToCDB(this.current);
        }
        if (this.prices) {
            this.prices = FM.Util.ToCDB(this.prices);
        }
        if (this.manufacturer) {
            this.manufacturer = FM.Util.ToCDB(this.manufacturer);
        }
        if (this.factoryNum) {
            this.factoryNum = FM.Util.ToCDB(this.factoryNum);
        }
        if (this.plotNum) {
            this.plotNum = FM.Util.ToCDB(this.plotNum);
        }
        if (this.productNum) {
            this.productNum = FM.Util.ToCDB(this.productNum);
        }
        if (this.parkingNum) {
            this.parkingNum = FM.Util.ToCDB(this.parkingNum);
        }
    }

});
