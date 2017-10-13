/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdRestrictionDetail = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDRESTRICTIONDETAIL';
        this.pid = data.pid || 0;
        this.restricPid = data.restricPid || 0;
        this.outLinkPid = data.outLinkPid || 0;
        this.flag = (data.flag === undefined || data.flag === '') ? 2 : data.flag;
        this.restricInfo = data.restricInfo || 0;
        this.type = (data.type === undefined || data.type === '') ? 1 : data.type;
        this.relationshipType = (data.relationshipType === undefined || data.relationshipType === '') ? 1 : data.relationshipType;

        this.conditions = [];
        if (data.conditions && data.conditions.length > 0) {
            for (var i = 0, len = data.conditions.length; i < len; i++) {
                var condition = FM.dataApi.rdRestrictionCondition(data.conditions[i]);
                this.conditions.push(condition);
            }
        }

        this.vias = [];
        if (data.vias && data.vias.length > 0) {
            for (var j = 0, viaLen = data.vias.length; j < viaLen; j++) {
                var vias = FM.dataApi.rdRestrictionVias(data.vias[j]);
                this.vias.push(vias);
            }
        }
        this.vias.sort(function (a, b) {
            return a.seqNum - b.seqNum;
        });
        this.rowId = data.rowId || null;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.restricPid = this.restricPid;
        data.outLinkPid = this.outLinkPid;
        data.flag = this.flag;
        data.restricInfo = this.restricInfo;
        data.type = this.type;
        data.relationshipType = this.relationshipType;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.restricPid = this.restricPid;
        data.outLinkPid = this.outLinkPid;
        data.flag = this.flag;
        data.restricInfo = this.restricInfo;
        data.type = this.type;
        data.relationshipType = this.relationshipType;
        // data.geoLiveType = this.geoLiveType;
        var conditions = [];
        var cond;
        for (var i = 0, len = this.conditions.length; i < len; i++) {
            cond = this.conditions[i].getIntegrate();
            if (cond) {
                conditions.push(cond);
            }
        }
        data.conditions = conditions;

        var vias = [];
        for (var j = 0, viaLen = this.vias.length; j < viaLen; j++) {
            vias.push(this.vias[j].getIntegrate());
        }
        data.vias = vias;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
FM.dataApi.rdRestrictionDetail = function (data, options) {
    return new FM.dataApi.RdRestrictionDetail(data, options);
};
