/**
 * Created by wuz on 2017/6/5.
 */
FM.dataApi.AgentPoiContact = FM.dataApi.DataModel.extend({
    geoLiveType: 'AGENT_CONTACT',
    setAttributes: function (data) {
        this.poiPid = data.poiPid || 0;
        this.contactType = data.contactType || 1;
        this.contact = data.contact || null;
        this.contactDepart = data.contactDepart || 0;
        this.priority = data.priority || 1;
        this.rowId = data.rowId || null;
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        var ret = {};
        ret.poiPid = this.poiPid;
        ret.contactType = this.contactType;
        ret.contact = this.contact;
        ret.contactDepart = this.contactDepart;
        ret.priority = this.priority;
        ret.rowId = this.rowId;
        return ret;
    }
});
