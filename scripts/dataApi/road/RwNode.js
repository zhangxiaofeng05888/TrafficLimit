/**
 * Created by linglong on 2016/12/16.
 */
FM.dataApi.RwNode = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RWNODE';
        this.pid = data.pid;
        this.kind = data.kind;
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
        data.kind = this.kind;
        data.form = this.form;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.form = this.form;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.rwNode = function (data, options) {
    return new FM.dataApi.RwNode(data, options);
};

