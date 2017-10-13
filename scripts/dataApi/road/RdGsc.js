/**
 * Created by zhaohang on 2016/4/7.
 */
FM.dataApi.RdGsc = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDGSC';
        this.pid = data.pid;
        this.geometry = data.geometry;
        // this.processFlag = data.processFlag || 1;
        if (typeof data.processFlag !== 'undefined') {
            this.processFlag = data.processFlag;
        } else {
            this.processFlag = 1;
        }
        this.links = [];
        if (data.links && data.links.length > 0) {
            for (var i = 0, len = data.links.length; i < len; i++) {
                var link = FM.dataApi.rdGscLink(data.links[i]);
                this.links.push(link);
            }
        }
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.geometry = this.geometry;
        data.processFlag = this.processFlag;
        // data.geoLiveType = this.geoLiveType;

        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data.links = links;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.geometry = this.geometry;
        data.processFlag = this.processFlag;
        data.geoLiveType = this.geoLiveType;

        var links = [];
        for (var i = 0, len = this.links.length; i < len; i++) {
            links.push(this.links[i].getIntegrate());
        }
        data.links = links;
        data.rowId = this.rowId;
        return data;
    }
});

FM.dataApi.rdGsc = function (data, options) {
    return new FM.dataApi.RdGsc(data, options);
};

