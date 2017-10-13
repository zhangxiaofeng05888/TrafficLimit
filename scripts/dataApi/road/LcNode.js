/**
 * Created by linglong on 2016/7/25.
 */
FM.dataApi.LcNode = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'LCNODE';
        this.pid = data.pid;
        this.form = data.form;
        this.geometry = data.geometry;
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
        data.form = this.form;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.form = this.form;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.lcNode = function (data, options) {
    return new FM.dataApi.LCNode(data, options);
};

