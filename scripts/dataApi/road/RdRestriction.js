/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

FM.dataApi.RdRestriction = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        if (!data.pid) {
            throw new Error('对象没有对应pid');
        }
        this.geoLiveType = 'RDRESTRICTION';
        this.pid = data.pid || null;
        this.inLinkPid = data.inLinkPid || null;
        this.nodePid = data.nodePid || null;
        this.restricInfo = data.restricInfo || null;
        this.kgFlag = data.kgFlag || 0;

        this.details = [];
        if (data.details && data.details.length > 0) {
            for (var i = 0, len = data.details.length; i < len; i++) {
                var detail = FM.dataApi.rdRestrictionDetail(data.details[i]);
                this.details.push(detail);
            }
        }
        // 按照掉左直右排序
        var sortOrder = {
            4: 1,
            2: 2,
            1: 3,
            3: 4,
            0: 5
        };
        this.details.sort(function (a, b) {
            return sortOrder[a.restricInfo] > sortOrder[b.restricInfo];
        });
        this.rowId = data.rowId || null;

        if (this.isTruckRestriction()) {
            this.geoLiveType = 'RDRESTRICTIONTRUCK';
        }
    },

    isTruckRestriction: function () {
        var flag = false;
        var details = this.details;
        for (var i = 0; i < details.length; i++) {
            if (details[i].conditions && details[i].conditions[0]) {
                var bin = Utils.dec2bin(details[i].conditions[0].vehicle);
                var reverseBin = bin.split('').reverse();
                var a = reverseBin[1];
                var b = reverseBin[2];
                if (a === '1' || b === '1') {
                    flag = true;
                }
            }
        }
        return flag;
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
        data.inLinkPid = this.inLinkPid;
        data.restricInfo = this.restricInfo;
        data.kgFlag = this.kgFlag;
        data.geoLiveType = this.geoLiveType;
        data.details = this.details;
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
        data.inLinkPid = this.inLinkPid;
        data.restricInfo = this.restricInfo;
        // data.geoLiveType = this.geoLiveType;
        data.kgFlag = this.kgFlag;
        data.nodePid = this.nodePid;
        var details = [];
        for (var i = 0, len = this.details.length; i < len; i++) {
            details.push(this.details[i].getIntegrate());
        }
        data.details = details;
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var details = [];
        for (var i = 0, len = this.details.length; i < len; i++) {
            details = this.details[i].getIntegrate();
            if (details.type == 2) {
                if (details.conditions.length) {
                    for (var j = 0; j < details.conditions.length; j++) {
                        if (details.pid == details.conditions[j].detailId) {
                            if (!details.conditions[j].timeDomain) {
                                this._pushError('RES_TIME', '限制类型为时间段禁止时，时间段不能为空！');
                            }
                        }
                    }
                } else {    // 有可能出现类型为时间段禁止，但是并未选择时间
                    this._pushError('RES_TIME', '限制类型为时间段禁止时，时间段不能为空！');
                }
            }
        }
    }
});

/** *
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
FM.dataApi.rdRestriction = function (data, options) {
    return new FM.dataApi.RdRestriction(data, options);
};
