/**
 * Created by liuyang on 2016/11/14.
 * Class RdLaneTopoDetail
 */

FM.dataApi.RdLaneTopoDetail = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDLANETOPODETAIL';
        this.pid = data.pid;// topoId
        this.inLanePid = data.inLanePid;
        this.outLanePid = data.outLanePid;
        this.inLinkPid = data.inLinkPid;
        this.outLinkPid = data.outLinkPid;
        this.nodePid = data.nodePid;
        this.reachDir = data.reachDir || 0;
        this.vehicle = data.vehicle || 0;
        this.timeDomain = data.timeDomain || '';
        this.processFlag = data.processFlag || 2;
        this.throughTurn = data.throughTurn || 0;
        this.laneTopoVias = [];
        if (data.topoVias && data.topoVias.length > 0) {
            for (var i = 0; i < data.topoVias.length; i++) {
                var topoVias = FM.dataApi.rdLaneTopoVia(data.topoVias[i]);
                this.laneTopoVias.push(topoVias);
            }
        }
        this.rowId = data.rowId || null;
    },

    /**
     * 获取RdLaneTopoDetail简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.inLanePid = this.inLanePid;
        data.outLanePid = this.outLanePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.nodePid = this.nodePid;
        data.reachDir = this.reachDir;
        data.vehicle = this.vehicle;
        data.timeDomain = this.timeDomain;
        data.processFlag = this.processFlag;
        data.throughTurn = this.throughTurn;
        data.laneTopoVias = [];
        for (var i = 0; i < this.laneTopoVias.length; i++) {
            data.laneTopoVias.push(this.laneTopoVias[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取RdLaneTopoDetail详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.inLanePid = this.inLanePid;
        data.outLanePid = this.outLanePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.nodePid = this.nodePid;
        data.reachDir = this.reachDir;
        data.vehicle = this.vehicle;
        data.timeDomain = this.timeDomain;
        data.processFlag = this.processFlag;
        data.throughTurn = this.throughTurn;
        data.laneTopoVias = [];
        for (var i = 0; i < this.laneTopoVias.length; i++) {
            data.laneTopoVias.push(this.laneTopoVias[i].getIntegrate());
        }
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * RdLaneTopoDetail初始化函数
 * @param data
 * @param options 其他可选参数
 * @returns {.dataApi.RdLaneTopoDetail}
 */
FM.dataApi.rdLaneTopoDetail = function (data, options) {
    return new FM.dataApi.RdLaneTopoDetail(data, options);
};
