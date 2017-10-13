/**
 * Created by liuzhe on 2016/7/25.
 */
FM.dataApi.CmgBuildLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = data.geoLiveType;
        this.pid = data.pid;
        this.sNodePid = data.sNodePid;
        this.eNodePid = data.eNodePid;
        this.kind = data.kind;
        this.geometry = data.geometry;
        this.length = data.length || 0;
        this.rowId = data.rowId || null;

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

        data.geoLiveType = this.geoLiveType;
        data.pid = this.pid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kind = this.kind;
        data.geometry = this.geometry;
        data.length = this.length;
        data.rowId = this.rowId;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;

        return data;
    },

    getSnapShot: function () {
        return this.getIntegrate();
    }
});
