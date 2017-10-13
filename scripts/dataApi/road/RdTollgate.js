/**
 * Created by wangmingdong on 2016/8/9.
 * Class Rdnode
 */

FM.dataApi.RdTollgate = FM.dataApi.Feature.extend({
    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    setAttributes: function (data) {
        this.geoLiveType = 'RDTOLLGATE';
        this.pid = data.pid || 0;
        this.nodePid = data.nodePid;
        this.inLinkPid = data.inLinkPid;
        this.outLinkPid = data.outLinkPid;
        this.type = data.type || 0;
        this.passageNum = data.passageNum || 0;
        this.etcFigureCode = data.etcFigureCode || null;
        this.hwName = data.hwName || null;
        this.photoFlag = data.photoFlag || 1;
        this.feeType = data.feeType;
        if (data.feeType == '') {
            this.feeType = 2;
        }
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0; i < data.names.length; i++) {
                var name = FM.dataApi.rdTollgateName(data.names[i]);
                this.names.push(name);
            }
        }
        this.passages = [];
        if (data.passages && data.passages.length > 0) {
            for (var j = 0; j < data.passages.length; j++) {
                var passage = FM.dataApi.rdTollgatePassage(data.passages[j]);
                this.passages.push(passage);
            }
        }
        this.feeStd = data.feeStd || 0;
        this.locationFlag = data.locationFlag || 0;
        this.rowId = data.rowId || null;
        if (typeof data.truckFlag !== 'undefined') {
            this.truckFlag = data.truckFlag;
        } else {
            this.truckFlag = 1;
        }
    },

    /**
     * 获取RdTollgate简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.nodePid = this.nodePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.type = this.type;
        data.passageNum = this.passageNum;
        data.etcFigureCode = this.etcFigureCode;
        data.hwName = this.hwName;
        this.photoFlag = data.photoFlag || 1;
        data.feeType = this.feeType;
        data.feeStd = this.feeStd;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        data.passages = [];
        for (var j = 0; j < this.passages.length; j++) {
            data.passages.push(this.passages[j].getIntegrate());
        }
        data.locationFlag = this.locationFlag;
        data.rowId = this.rowId;
        data.truckFlag = this.truckFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTollgate详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.nodePid = this.nodePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.type = this.type;
        data.passageNum = this.passageNum;
        data.etcFigureCode = this.etcFigureCode;
        data.hwName = this.hwName;
        data.photoFlag = this.photoFlag;
        data.feeType = this.feeType;
        data.feeStd = this.feeStd;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        data.passages = [];
        for (var j = 0; j < this.passages.length; j++) {
            data.passages.push(this.passages[j].getIntegrate());
        }
        data.locationFlag = this.locationFlag;
        data.truckFlag = this.truckFlag;
        data.rowId = this.rowId;
        return data;
    },

    _doValidate: function () {
        var _self = this;
        var nameGroup = [];
        this.names.forEach(function (item) {
            if (!nameGroup[item.nameGroupid - 1]) {
                nameGroup[item.nameGroupid - 1] = [];
            }
            nameGroup[item.nameGroupid - 1].push(item);
        });


        // 判断多音字是否进行了选择
        nameGroup.forEach(function (item, outerIndex) {
            for (var i = 0; i < item.length; i++) {
                if (item[i].langCode === 'CHI' || item.langCode === 'CHT') {
                    if (item[i].phoneticArr.length) {
                        for (var j = 0; j < item[i].phoneticArr.length; j++) {
                            if (item[i].phoneticArr[j].length > 1) {
                                _self._pushError('多音字检查', '请选择多音字');
                                break;
                            }
                        }
                    }
                }
            }
        });
    }
});

/** *
 * RdTollgate初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.rdTollgate = function (data, options) {
    return new FM.dataApi.RdTollgate(data, options);
};
