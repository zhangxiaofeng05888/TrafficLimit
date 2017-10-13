/**
 * Created by linglong on 2016/8/26.
 */
FM.dataApi.IxPoiDetail = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_DETAIL',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.webSite = data.webSite || '';
        // this.fax = [];
        // var fax = data.fax.split('|');
        // for (var i = 0; i < fax.length; i++) {
        //     this.fax.push(fax[i]);
        // }
        this.starHotel = data.starHotel || '';
        this.briefDesc = data.briefDesc || '';
        this.adverFlag = data.adverFlag || 0;
        this.photoName = data.photoName || '';
        this.reserved = data.reserved || '';
        this.memo = data.memo || '';
        this.hwEntryexit = data.hwEntryexit || 0;
        this.paycard = data.paycard || 0;
        this.cardtype = [];
        if (data.cardtype !== undefined) {
            var cardtype = data.cardtype.split('|');
            for (var j = 0; j < cardtype.length; j++) {
                this.cardtype.push(cardtype[j]);
            }
        }
        this.hospitalClass = data.hospitalClass || 0;
        this.rowId = data.rowId || null;
    },

    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.webSite = this.webSite;
        // ret.fax = [];
        // for (var i = 0; i < this.fax.length; i++) {
        //     ret.fax.push(this.fax[i]);
        // }
        ret.starHotel = this.starHotel;
        ret.briefDesc = this.briefDesc;
        ret.adverFlag = this.adverFlag;
        ret.photoName = this.photoName;
        ret.reserved = this.reserved;
        ret.memo = this.memo;
        ret.hwEntryexit = this.hwEntryexit;
        ret.paycard = this.paycard;
        ret.cardtype = [];
        if (this.cardtype !== undefined) {
            for (var j = 0; j < this.cardtype.length; j++) {
                ret.cardtype.push(this.cardtype[j]);
            }
        }
        ret.hospitalClass = this.hospitalClass;
        ret.rowId = this.rowId;
        return ret;
    }
});
