/**
 * Created by mali on 2017/4/19.
 */
FM.dataApi.RoadName = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ROADNAME';
        this.pid = data.pid || null;
        this.nameId = data.nameId || null;
        this.nameGroupid = data.nameGroupid || null;
        this.langCode = data.langCode || 'CHI';
        this.name = data.name || '';
        this.type = data.type || '';
        this.base = data.base || '';
        this.prefix = data.prefix || '';
        this.infix = data.infix || '';
        this.suffix = data.suffix || '';
        this.namePhonetic = data.namePhonetic || '';
        this.typePhonetic = data.typePhonetic || '';
        this.basePhonetic = data.basePhonetic || '';
        this.prefixPhonetic = data.prefixPhonetic || '';
        this.infixPhonetic = data.infixPhonetic || '';
        this.suffixPhonetic = data.suffixPhonetic || '';
        this.srcFlag = (data.srcFlag === undefined || data.srcFlag === '') ? 0 : data.srcFlag;
        this.roadType = (data.roadType === undefined || data.roadType === '') ? 0 : data.roadType;
        this.adminId = data.adminId || null;
        this.codeType = (data.codeType === undefined || data.codeType === '') ? 0 : data.codeType;
        this.voiceFile = data.voiceFile || '';
        this.srcResume = data.srcResume || '';
        this.paRegionId = data.paRegionId || null;
        this.splitFlag = (data.splitFlag === undefined || data.splitFlag === '') ? 0 : data.splitFlag;
        this.memo = data.memo || '';
        this.routeId = (data.routeId === undefined || data.routeId === '') ? 0 : data.routeId;
        this.uRecord = data.uRecord || null;
        this.uFields = data.uFields || '';
        this.city = data.city || '';
        this.adminName = data.adminName || '';
        this.hwInfoFlag = null;
        this.rowId = data.rowId || null;
    },

    /*
     *获取的道路名信息
     */
    getIntegrate: function () {
        var data = {};
        data.nameId = this.nameId;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.name = this.name;
        data.type = this.type;
        data.base = this.base;
        data.prefix = this.prefix;
        data.infix = this.infix;
        data.suffix = this.suffix;
        data.namePhonetic = this.namePhonetic;
        data.typePhonetic = this.typePhonetic;
        data.basePhonetic = this.basePhonetic;
        data.prefixPhonetic = this.prefixPhonetic;
        data.infixPhonetic = this.infixPhonetic;
        data.suffixPhonetic = this.suffixPhonetic;
        data.srcFlag = this.srcFlag;
        data.roadType = this.roadType;
        data.adminId = this.adminId;
        data.codeType = this.codeType;
        data.voiceFile = this.voiceFile;
        data.srcResume = this.srcResume;
        data.paRegionId = this.paRegionId;
        data.splitFlag = this.splitFlag;
        data.memo = this.memo;
        data.routeId = this.routeId;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        data.city = this.city;
        data.adminName = this.adminName;
        data.hwInfoFlag = this.hwInfoFlag;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.nameId = this.nameId;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.name = this.name;
        data.type = this.type || '';
        data.base = this.base || '';
        data.prefix = this.prefix;
        data.infix = this.infix;
        data.suffix = this.suffix;
        data.namePhonetic = this.namePhonetic;
        data.typePhonetic = this.typePhonetic;
        data.basePhonetic = this.basePhonetic;
        data.prefixPhonetic = this.prefixPhonetic;
        data.infixPhonetic = this.infixPhonetic;
        data.suffixPhonetic = this.suffixPhonetic;
        data.srcFlag = this.srcFlag;
        data.roadType = this.roadType;
        data.adminId = this.adminId || '';
        data.codeType = this.codeType;
        data.voiceFile = this.voiceFile;
        data.srcResume = this.srcResume;
        data.paRegionId = this.paRegionId;
        data.splitFlag = this.splitFlag;
        data.memo = this.memo;
        data.routeId = this.routeId;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        data.city = this.city;
        data.adminName = this.adminName;
        data.geoLiveType = this.geoLiveType;
        data.hwInfoFlag = this.hwInfoFlag;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.roadName = function (data, options) {
    return new FM.dataApi.RoadName(data, options);
};
