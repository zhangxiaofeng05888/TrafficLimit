/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchSeriesBranch = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHSERIESBRANCH';
        this.rowId = data.rowId || null;
        this.pid = data.pid;
        this.voiceDir = data.voiceDir || 0;
        this.arrowCode = data.arrowCode || '';
        this.type = data.type || 0;
        this.patternCode = data.patternCode || '';
        this.arrowFlag = data.arrowFlag || 0;
    },

    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.pid = this.pid;
        data.voiceDir = this.voiceDir;
        data.arrowCode = this.arrowCode;
        data.type = this.type;
        data.patternCode = this.patternCode;
        data.arrowFlag = this.arrowFlag;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.rowId = this.rowId;
        data.pid = this.pid;
        data.voiceDir = this.voiceDir;
        data.arrowCode = this.arrowCode;
        data.type = this.type;
        data.patternCode = this.patternCode;
        data.arrowFlag = this.arrowFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdBranchSeriesBranch = function (data, options) {
    return new FM.dataApi.RdBranchSeriesBranch(data, options);
};
