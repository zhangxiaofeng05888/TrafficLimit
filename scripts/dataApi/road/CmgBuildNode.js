/**
 * Created by liuzhe on 2016/7/25.
 */
FM.dataApi.CmgBuildNode = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid;
        this.form = data.form;
        this.geometry = data.geometry;
        this.geoLiveType = data.geoLiveType;
        this.links = data.links || [];
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

        data.pid = this.pid;
        data.form = this.form;
        data.geometry = this.geometry;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        data.editFlag = this.editFlag;
        data.meshId = this.meshId;

        return data;
    },

    getSnapShot: function () {
        return this.getIntegrate();
    }
});
