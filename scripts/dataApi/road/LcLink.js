/**
 * Created by linglong on 2016/7/25.
 */
FM.dataApi.LcLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'LCLINK';
        this.pid = data.pid;
        this.sNodePid = data.sNodePid;
        this.eNodePid = data.eNodePid;
        this.geometry = data.geometry;
        this.length = data.length || 0;
        this.kinds = [];
        if (data.kinds.length) {
            for (var i = 0, len = data.kinds.length; i < len; i++) {
                this.kinds.push(FM.dataApi.lcLinkKind(data.kinds[i]));
            }
        }
        // this.editFlag = data.editFlag || 1;
        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }
        var str = [];
        for (var j = 0; j < data.meshes.length; j++) {
            str.push(data.meshes[j].meshId);
        }
        this.meshId = str.join(',');
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.geometry = this.geometry;
        data.length = this.length;
        // data.geoLiveType = this.geoLiveType;
        data.kinds = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data.kinds.push(this.kinds[i].getIntegrate());
            }
        }
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.geometry = this.geometry;
        data.length = this.length;
        data.geoLiveType = this.geoLiveType;
        data.kinds = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data.kinds.push(this.kinds[i].getIntegrate());
            }
        }
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.lcLink = function (data, options) {
    return new FM.dataApi.LCLink(data, options);
};
