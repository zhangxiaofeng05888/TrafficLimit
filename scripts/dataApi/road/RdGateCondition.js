/**
 * Created by mali on 2016/8/1.
 * Class RdGateCondition
 */

FM.dataApi.RdGateCondition = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDGATECONDITION';
        this.pid = data.pid;
        this.validObj = data.validObj || 0;
        this.timeDomain = data.timeDomain || '';
        this.rowId = data.rowId || null;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.validObj = this.validObj;
        data.timeDomain = this.timeDomain;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.validObj = this.validObj;
        data.timeDomain = this.timeDomain;
        data.rowId = this.rowId;
       // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdGateCondition = function (data, options) {
    return new FM.dataApi.RdGateCondition(data, options);
};

