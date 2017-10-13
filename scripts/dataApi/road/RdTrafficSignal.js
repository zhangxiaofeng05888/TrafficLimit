/**
 * Created by wangmingdong on 2016/7/20.
 * Class Rdnode
 */

FM.dataApi.RdTrafficSignal = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDTRAFFICSIGNAL';
        this.pid = data.pid || '';
        this.nodePid = data.nodePid;
        this.linkPid = data.linkPid;
        this.location = data.location;
        this.flag = data.flag || 0;
        this.rowId = data.rowId || null;

        this.type = data.type || 0;
        this.kgFlag = data.kgFlag || 0;
        this.uRecord = data.uRecord || 0;
    },

    /**
     * 获取RdTrafficSignal简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = parseInt(this.pid, 10);
        data.nodePid = parseInt(this.nodePid, 10);
        data.linkPid = parseInt(this.linkPid, 10);
        data.location = parseInt(this.location, 2);
        data.flag = parseInt(this.flag, 10);
        data.rowId = this.rowId;
        data.type = parseInt(this.type, 10);
        data.kgFlag = parseInt(this.kgFlag, 10);
        data.uRecord = this.uRecord;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTrafficSignal详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = parseInt(this.pid, 10);
        data.nodePid = parseInt(this.nodePid, 10);
        data.linkPid = parseInt(this.linkPid, 10);
        data.location = parseInt(this.location, 10);
        data.flag = parseInt(this.flag, 10);
        data.rowId = this.rowId;
        data.type = parseInt(this.type, 10);
        data.kgFlag = parseInt(this.kgFlag, 10);
        data.uRecord = this.uRecord;
        return data;
    }
});

/** *
 * RdTrafficSignal初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdTrafficSignal = function (data, options) {
    return new FM.dataApi.RdTrafficSignal(data, options);
};

