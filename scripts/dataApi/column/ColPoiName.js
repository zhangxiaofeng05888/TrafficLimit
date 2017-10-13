/**
 * Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoiName = FM.dataApi.DataModel.extend({
    dataModelType: 'COL_POI_NAME',
    /*
     * DB-->UI
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.poiPid = data.poiPid || 0;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode;
        this.nameClass = data.nameClass || 1;
        this.nameType = data.nameType || 1;
        this.name = data.name || '';

        this.namePhonetic = data.namePhonetic || '';
        this.nameStrPinyin = data.nameStrPinyin || '';
        this.multiPinyin = data.multiPinyin || '';
        this.nameFlags = {};

        this.nameFlags = [];
        if (data.nameFlags && data.nameFlags.length > 0) {
            for (var p = 0; p < data.nameFlags.length; p++) {
                var obj = new FM.dataApi.ColPoiNameFlag(data.nameFlags[p]);
                this.nameFlags.push(obj);
            }
        } else {
            // this.nameFlags.push(new FM.dataApi.ColPoiNameFlag({ nameId: this.pid }));
        }

        this.rowId = data.rowId || '';
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.poiPid = this.poiPid;
        ret.nameGroupid = this.nameGroupid;
        ret.langCode = this.langCode;
        ret.nameClass = this.nameClass;
        ret.nameType = this.nameType;
        ret.name = this.name;
        ret.nameFlags = [];
        for (var i = 0; i < this.nameFlags.length; i++) {
            ret.nameFlags.push(this.nameFlags[i].getIntegrate());
        }
        ret.namePhonetic = this.namePhonetic;
        // ret.nameStrPinyin = this.nameStrPinyin;
        // ret.multiPinyin = this.multiPinyin;
        ret.rowId = this.rowId;
        return ret;
    }
});
