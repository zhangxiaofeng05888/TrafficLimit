/**
 * Created by zhaohang on 2016/4/5.
 */
FM.dataApi.AdLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ADLINK';
        this.pid = data.pid;
        this.sNodePid = data.sNodePid;
        this.eNodePid = data.eNodePid;
        // this.kind = data.kind || 1;
        if (typeof data.kind !== 'undefined') {
            this.kind = data.kind;
        } else {
            this.kind = 1;
        }
        // this.form = data.form || 1;
        if (typeof data.form !== 'undefined') {
            this.form = data.form;
        } else {
            this.form = 1;
        }
        this.geometry = data.geometry;
        this.length = data.length || 0;
        this.scale = data.scale || 0;
        // this.editFlag = data.editFlag || 1;
        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }
        var str = [];
        for (var i = 0; i < data.meshes.length; i++) {
            str.push(data.meshes[i].meshId);
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
        data.kind = this.kind;
        data.form = this.form;
        data.geometry = this.geometry;
        data.length = this.length;
        data.scale = this.scale;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kind = this.kind;
        data.form = this.form;
        data.geometry = this.geometry;
        data.length = this.length;
        data.scale = this.scale;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.adLink = function (data, options) {
    return new FM.dataApi.AdLink(data, options);
};

