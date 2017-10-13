/**
 * Created by wuz on 2016/12/29.
 */
FM.dataApi.ColPoiNameFlag = FM.dataApi.DataModel.extend({
    dataModelType: 'COL_POI_NAME_Flag',

    setAttributes: function (data) {
        this.nameId = data.nameId || 0;
        this.flagCode = data.flagCode || '';
        this.rowId = data.rowId || '';
    },
    getIntegrate: function () {
        var ret = {};
        ret.nameId = this.nameId;
        ret.flagCode = this.flagCode;
        ret.rowId = this.rowId;
        return ret;
    }
});
