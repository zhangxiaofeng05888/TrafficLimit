/**
 * Created by wangmingdong on 2016/11/22.
 */
FM.dataApi.RdTmcLocation = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDTMCLOCATION';
        this.pid = data.pid;
        this.tmcId = data.tmcId || 0;
        this.loctableId = data.loctableId || 0;
        this.rowId = data.rowId || null;
        this.links = [];
        if (data.links && data.links.length > 0) {
            for (var i = 0; i < data.links.length; i++) {
                var link = FM.dataApi.rdTmcLocationLink(data.links[i]);
                this.links.push(link);
            }
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.rowId = this.rowId;
        data.links = [];
        for (var i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        // data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.rowId = this.rowId;
        data.links = [];
        for (var i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        return data;
    }

});

FM.dataApi.rdTmcLocation = function (data, options) {
    return new FM.dataApi.RdTmcLocation(data, options);
};

