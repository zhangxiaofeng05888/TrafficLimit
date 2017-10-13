/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdLaneTopology = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLANETOPOLOGY';
        this.pid = data.pid || 0;
        this.connexityPid = data.connexityPid;
        this.outLinkPid = data.outLinkPid;
        this.inLaneInfo = FM.Util.decimal2BinaryArray(data.inLaneInfo || 0, 16);
        this.busLaneInfo = FM.Util.decimal2BinaryArray(data.busLaneInfo || 0, 16);
        this.reachDir = data.reachDir || 0;
        this.relationshipType = data.relationshipType || 1;
        this.vias = [];
        for (var i = 0; i < data.vias.length; i++) {
            var via = FM.dataApi.rdLaneVIA(data.vias[i]);
            this.vias.push(via);
        }
        this.rowId = data.rowId || null;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.outLinkPid = this.outLinkPid;
        data.connexityPid = this.connexityPid;
        data.inLaneInfo = FM.Util.binaryArray2Decimal(this.inLaneInfo);
        data.busLaneInfo = FM.Util.binaryArray2Decimal(this.busLaneInfo);
        data.reachDir = this.reachDir;
        data.relationshipType = this.relationshipType;
        data.vias = [];
        data.geoLiveType = this.geoLiveType;
        for (var i = 0; i < this.vias.length; i++) {
            data.vias.push(this.vias.getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.outLinkPid = this.outLinkPid;
        data.connexityPid = this.connexityPid;
        data.inLaneInfo = FM.Util.binaryArray2Decimal(this.inLaneInfo);
        data.busLaneInfo = FM.Util.binaryArray2Decimal(this.busLaneInfo);
        data.reachDir = this.reachDir;
        data.relationshipType = this.relationshipType;
        data.vias = [];
        // data.geoLiveType = this.geoLiveType;
        for (var i = 0; i < this.vias.length; i++) {
            data.vias.push(this.vias[i].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    }
});
/** *
 * rdLaneConnexity topos初始化函数
 * @param data 车信数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdlanetopology}
 */
FM.dataApi.rdLaneTopology = function (data, options) {
    return new FM.dataApi.RdLaneTopology(data, options);
};
