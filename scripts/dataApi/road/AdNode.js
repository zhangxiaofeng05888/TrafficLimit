/**
 * Created by zhaohang on 2016/4/25.
 */

FM.dataApi.AdNode = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ADNODE';
        this.pid = data.pid;
        this.kind = data.kind || 1;
        this.form = data.form || 0;
        this.geometry = data.geometry;
        // this.editFlag = data.editFlag || 1;
        if (typeof data.editFlag !== 'undefined') {
            this.editFlag = data.editFlag;
        } else {
            this.editFlag = 1;
        }
        this.meshes = data.meshes;
        var str = [];
        for (var i = 0; i < data.meshes.length; i++) {
            str.push(data.meshes[i].meshId);
        }
        this.meshId = str.join(',');
        this.links = data.links || [];
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.form = this.form;
        data.geometry = this.geometry;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.form = this.form;
        data.geometry = this.geometry;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.adNode = function (data, options) {
    return new FM.dataApi.AdNode(data, options);
};

