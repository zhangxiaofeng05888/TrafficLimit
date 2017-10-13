/**
 * Created by liuyang on 2016/6/29.
 */
FM.dataApi.ZoneLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ZONELINK';
        this.pid = data.pid;
        this.rowId = data.rowId || null;
        this.sNodePid = data.sNodePid;
        this.eNodePid = data.eNodePid;
        this.kinds = [];
        if (data.kinds) {
            for (var i = 0, len = data.kinds.length; i < len; i++) {
                this.kinds.push(FM.dataApi.zoneLinkKind(data.kinds[i]));
            }
        }
        this.geometry = data.geometry;
        this.length = data.length || 0;
        this.scale = data.scale || 0;
        this.editFlag = data.editFlag || 1;
        var str = [];
        for (var j = 0; j < data.meshes.length; j++) {
            str.push(data.meshes[j].meshId);
        }
        this.meshId = str.join(',');
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kinds = [];
        // data.geoLiveType = this.geoLiveType;
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data.kinds.push(this.kinds[i].getIntegrate());
            }
        }
        data.geometry = this.geometry;
        data.length = this.length;
        data.scale = this.scale;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kinds = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data.kinds.push(this.kinds[i].getIntegrate());
            }
        }
        data.geometry = this.geometry;
        data.length = this.length;
        data.scale = this.scale;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        return data;
    }

});

FM.dataApi.zoneLink = function (data, options) {
    return new FM.dataApi.ZoneLink(data, options);
};

