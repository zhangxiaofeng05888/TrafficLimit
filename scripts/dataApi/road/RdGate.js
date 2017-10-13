/**
 * Created by mali on 2016/7/20.
 * Class RdGate
 */

FM.dataApi.RdGate = FM.dataApi.Feature.extend({

    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDGATE';
        this.pid = data.pid;
        this.inLinkPid = data.inLinkPid;
        this.nodePid = data.nodePid;
        this.outLinkPid = data.outLinkPid;
        // this.type = (data.type === undefined || data.type === '') ? 2 : data.type;
        if (typeof data.type !== 'undefined') {
            this.type = data.type;
        } else {
            this.type = 2;
        }
        // this.dir = (data.dir === undefined || data.dir === '') ? 2 : data.dir;
        if (typeof data.dir !== 'undefined') {
            this.dir = data.dir;
        } else {
            this.dir = 2;
        }
        this.fee = data.fee || 0;
        this.condition = [];
        if (data.condition && data.condition.length > 0) {
            for (var i = 0, len = data.condition.length; i < len; i++) {
                var con = FM.dataApi.rdGateCondition(data.condition[i]);
                this.condition.push(con);
            }
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.inLinkPid = this.inLinkPid;
        data.nodePid = this.nodePid;
        data.outLinkPid = this.outLinkPid;
        data.type = this.type;
        data.dir = this.dir;
        data.fee = this.fee;

        var con = [];
        for (var i = 0, len = this.condition.length; i < len; i++) {
            con.push(this.condition[i].getIntegrate());
        }
        data.condition = con;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.inLinkPid = this.inLinkPid;
        data.nodePid = this.nodePid;
        data.outLinkPid = this.outLinkPid;
        data.type = this.type;
        data.dir = this.dir;
        data.fee = this.fee;

        var con = [];
        for (var i = 0, len = this.condition.length; i < len; i++) {
            con.push(this.condition[i].getIntegrate());
        }
        data.condition = con;
        data.rowId = this.rowId;
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdGate初始化函数
 */
FM.dataApi.rdGate = function (data, options) {
    return new FM.dataApi.RdGate(data, options);
};

