/**
 * Created by zhaohang on 2016/4/7.
 */
FM.dataApi.RdGscLink = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDGSCLINK';
        if (!data.pid) {
            throw new Error('form对象没有对应link');
        } else {
            this.id = data.pid;
        }
        this.pid = data.pid;
        this.zlevel = data.zlevel || 0;
        this.linkPid = data.linkPid || 0;
        this.tableName = data.tableName || '';
        this.shpSeqNum = data.shpSeqNum;
        this.startEnd = data.startEnd;
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.zlevel = this.zlevel;
        data.linkPid = this.linkPid;
        data.tableName = this.tableName;
        data.shpSeqNum = this.shpSeqNum;
        data.startEnd = this.startEnd;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.zlevel = this.zlevel;
        data.linkPid = this.linkPid;
        data.tableName = this.tableName;
        data.shpSeqNum = this.shpSeqNum;
        data.startEnd = this.startEnd;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.rdGscLink = function (data, options) {
    return new FM.dataApi.RdGscLink(data, options);
};
