/**
 * Created by mali on 2016/7/25.
 */
FM.dataApi.LuLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'LULINK';
        this.pid = data.pid;
        this.rowId = data.rowId || null;
        this.sNodePid = data.sNodePid;
        this.eNodePid = data.eNodePid;
        this.geometry = data.geometry;
        this.length = data.length || 0;
        this.linkKinds = [];
        if (data.linkKinds) {
            for (var i = 0, len = data.linkKinds.length; i < len; i++) {
                this.linkKinds.push(FM.dataApi.luLinkKind(data.linkKinds[i]));
            }
        }
        this.scale = data.scale || 0;
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
        data.geometry = this.geometry;
        data.length = this.length;
        data.geoLiveType = this.geoLiveType;
        data.linkKinds = [];
        if (this.linkKinds) {
            for (var i = 0, len = this.linkKinds.length; i < len; i++) {
                data.linkKinds.push(this.linkKinds[i].getIntegrate());
            }
        }
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
        data.geometry = this.geometry;
        data.geoLiveType = this.geoLiveType;
        data.length = this.length;
        data.linkKinds = [];
        if (this.linkKinds) {
            for (var i = 0, len = this.linkKinds.length; i < len; i++) {
                data.linkKinds.push(this.linkKinds[i].getIntegrate());
            }
        }
        data.scale = this.scale;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        return data;
    }

});

FM.dataApi.luLink = function (data, options) {
    return new FM.dataApi.LULink(data, options);
};
