/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.IxPoiContact = FM.dataApi.DataModel.extend({
    geoLiveType: 'IX_POI_CONTACT',
    setAttributes: function (data) {
        this.poiPid = data.poiPid || 0;
        this.contactType = data.contactType || 1;
        this.contact = data.contact || null;
        this.contactDepart = data.contactDepart || 0;
        this.priority = data.priority || 1;
        this.code = data.code || '';
        if ((this.contactType == 1 || this.contactType == 11) && this.contact && this.contact.indexOf('-') > -1) {
            var tmep = this.contact.split('-');
            this.code = tmep[0];
            this.contact = tmep[1];
        }
        this.rowId = data.rowId || null;
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        var ret = {};
        ret.contactType = this.contactType;
        ret.contact = this.contact;
        ret.contactDepart = this.contactDepart;
        ret.priority = this.priority;
        if (this.contactType == 1 || this.contactType == 11) {
            ret.contact = this.code + '-' + this.contact;
        }
        ret.rowId = this.rowId;
        return ret;
    }
});
