/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiRestaurant = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_POI_RESTAURANT',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.poiPid = data.poiPid || 0;
        this.foodTypeArr = data.foodType ? data.foodType.split('|') : [];
        this.foodType1 = {};
        this.foodType2 = {};
        var creditCardArr = data.creditCard ? data.creditCard.split('|') : [];
        this.creditCard = {};
        for (var i = 0; i < creditCardArr.length; i++) {
            this.creditCard[creditCardArr[i]] = true;
        }
        this.avgCost = data.avgCost || 0;
        this.parking = data.parking || 0;
        this.longDescription = data.longDescription;
        this.longDescriptionEng = data.longDescriptionEng;
        this.openHour = data.openHour;
        this.openHourEng = data.openHourEng;
        this.telephone = data.telephone;
        this.address = data.address;
        this.city = data.city;
        this.photoName = data.photoName;
        this.travelguideFlag = data.travelguideFlag || 0;
        this.rowId = data.rowId || null;
    },
    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.poiPid = this.poiPid;
        var foodType1Code = '';
        var foodType2Code = '';
        for (var k in this.foodType1) {
            if (this.foodType1[k] == true) {
                foodType1Code = k;
            }
        }
        for (var p in this.foodType2) {
            if (this.foodType2[p] == true) {
                foodType2Code = p;
            }
        }
        if (foodType2Code.length > 0 && foodType1Code.length > 0) {
            ret.foodType = foodType2Code + '|' + foodType1Code;
        } else if (foodType2Code.length > 0) {
            ret.foodType = foodType2Code;
        } else if (foodType1Code.length > 0) {
            ret.foodType = foodType1Code;
        } else {
            ret.foodType = this.foodTypeArr.join('|');
        }
        var checkedCreditCardArr = [];
        for (var q in this.creditCard) {
            if (this.creditCard[q] == true) {
                checkedCreditCardArr.push(q);
            }
        }
        ret.creditCard = checkedCreditCardArr.join('|');
        ret.avgCost = this.avgCost;
        ret.parking = this.parking;
        ret.longDescription = this.longDescription;
        ret.longDescriptionEng = this.longDescriptionEng;
        ret.openHour = this.openHour;
        ret.openHourEng = this.openHourEng;
        ret.telephone = this.telephone;
        ret.address = this.address;
        ret.city = this.city;
        ret.photoName = this.photoName;
        ret.travelguideFlag = this.travelguideFlag;
        ret.rowId = this.rowId;
        return ret;
    }
});
