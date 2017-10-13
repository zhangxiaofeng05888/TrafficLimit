/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchSchematic = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHSCHEMATIC';
        this.pid = data.pid;
        this.rowId = data.rowId || null;
        this.schematicCode = data.schematicCode || '';
        this.arrowCode = data.arrowCode || '';
        this.memo = data.memo || '';
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.schematicCode = this.schematicCode;
        data.arrowCode = this.arrowCode;
        data.memo = this.memo;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.schematicCode = this.schematicCode;
        data.arrowCode = this.arrowCode;
        data.memo = this.memo;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdBranchSchematic = function (data, options) {
    return new FM.dataApi.RdBranchSchematic(data, options);
};
