/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdLaneConnexity = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDLANECONNEXITY';
        this.pid = data.pid;
        this.inLinkPid = data.inLinkPid;
        this.nodePid = data.nodePid;
        this.lanes = this._splitLaneInfo(data.laneInfo || '');
        this.conflictFlag = data.conflictFlag || 0;
        this.kgFlag = data.kgFlag || 0;
        this.laneNum = data.laneNum || 0;
        this.leftExtend = data.leftExtend || 0;
        this.rightExtend = data.rightExtend || 0;
        this.topos = [];
        for (var i = 0; i < data.topos.length; i++) {
            var topos = FM.dataApi.rdLaneTopology(data.topos[i]);
            this.topos.push(topos);
        }
        this.rowId = data.rowId || null;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.inLinkPid = this.inLinkPid;
        data.nodePid = this.nodePid;
        data.laneInfo = this._mergeLaneInfo(this.lanes);
        data.conflictFlag = this.conflictFlag;
        data.kgFlag = this.kgFlag;
        data.laneNum = this.lanes.length;
        var lr = this._getLeftRightExtend(this.lanes);
        data.leftExtend = lr.left;
        data.rightExtend = lr.right;
        data.geoLiveType = this.geoLiveType;
        data.topos = [];
        for (var i = 0; i < this.topos.length; i++) {
            data.topos.push(this.topos[i].getIntegrate());
        }
        data.rowId = this.rowId;

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.inLinkPid = this.inLinkPid;
        data.nodePid = this.nodePid;
        data.laneInfo = this._mergeLaneInfo(this.lanes);
        data.conflictFlag = this.conflictFlag;
        data.kgFlag = this.kgFlag;
        data.laneNum = this.lanes.length;
        var lr = this._getLeftRightExtend(this.lanes);
        data.leftExtend = lr.left;
        data.rightExtend = lr.right;
        data.topos = [];
        for (var i = 0; i < this.topos.length; i++) {
            data.topos.push(this.topos[i].getIntegrate());
        }
        data.rowId = this.rowId;
        return data;
    },

    _splitLaneInfo: function (laneInfo) {
        var ret = [];
        var lanes = laneInfo.split(',');
        var lane,
            temp;
        for (var i = 0; i < lanes.length; i++) {
            lane = {
                direct: null,
                busDirect: null,
                extend: 0
            };
            if (lanes[i].indexOf('[') >= 0) { // 附加车道
                lane.extend = 1;
                lanes[i] = lanes[i].replace(/\[|]/g, '');
            }
            if (lanes[i].indexOf('<') >= 0) { // 公交车道
                lanes[i] = lanes[i].replace(/<|>/g, '');
                temp = lanes[i].split('');
                // 普通车道在前，公交车道在后
                if (temp[0] == '[') {
                    lane.direct = temp[1];
                } else {
                    lane.direct = temp[0];
                }
                lane.busDirect = temp[1];
            } else {
                lane.direct = lanes[i];
            }
            ret.push(lane);
        }
        return ret;
    },
    _mergeLaneInfo: function (lanes) {
        var lane;
        var temp = [];
        for (var k = 0; k < lanes.length; k++) {
            if (lanes[k].busDirect) {
                lane = lanes[k].direct + '<' + lanes[k].busDirect + '>';
            } else {
                lane = lanes[k].direct;
            }
            if (lanes[k].extend == 1) {
                lane = '[' + lane + ']';
            }
            temp.push(lane);
        }
        return temp.join(',');
    },
    _getLeftRightExtend: function (lanes) {
        var left = 0;
        var right = 0;
        var leftExtend = 0;
        var rightExtend = 0;
        var i;
        for (i = 0; i < lanes.length; i++) {
            if (lanes[i].extend == 1) {
                left++;
            } else {
                break;
            }
        }
        if (lanes.length == left) {
            leftExtend = Math.ceil(left / 2);
            rightExtend = Math.floor(left / 2);
        } else {
            leftExtend = left;
            for (i = lanes.length - 1; i > left; i--) {
                if (lanes[i].extend == 1) {
                    right++;
                } else {
                    break;
                }
            }
            rightExtend = right;
        }

        return {
            left: leftExtend,
            right: rightExtend
        };
    }
});
/** *
 * rdLaneConnexity初始化函数
 * @param data 车信数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdLaneConnexity}
 */
FM.dataApi.rdLaneConnexity = function (data, options) {
    return new FM.dataApi.RdLaneConnexity(data, options);
};
