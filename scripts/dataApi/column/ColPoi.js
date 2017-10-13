/**
 * Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoi = FM.dataApi.GeoDataModel.extend({
    geoLiveType: 'COL_POI',
    /*
     * DB-->UI
     */
    setAttributes: function (data) {
        this.pid = data.pid;
        this.rowId = data.rowId || '';
        this.kindCode = data.kindCode || null;
        this.classifyRules = data.classifyRules;
        this.refMsg = data.refMsg;
        this.addressList = data.addressList;
        // this.nameFlag = data.nameFlag || '';
        // this.photos = data.photos;
        this.photos = [];
        if (data.photos) {
            if (data.photos) {
                for (var m = 0, plen = data.photos.length; m < plen; m++) {
                    var photo = new FM.dataApi.ColPoiPhoto(data.photos[m]);
                    this.photos.push(photo);
                }
            }
        }

        this.meshId = data.meshId;
        this.detailArea = data.detailArea;
        this.parentName = data.parentName || '';
        this.kindName = data.kindName || '';
        this.chainName = data.chainName || '';
        this.parentGroupId = data.parentGroupId;
        this.childrenGroupId = data.childrenGroupId;
        this.nameList = data.nameList || [];
        this.ckRules = data.ckRules;
        this.namerefMsg = data.namerefMsg; // 名称的参考信息
        this.chiNameList = data.chiNameList; // 名称统一、简称作业、别名作业的参考信息
        this.whole = data.whole; // 地域
        this.poiNum = data.poiNum;
        this.isProblem = data.isProblem;    // 0 不显示 1 未查看 2 已查看 由于名称拼音存在多项，有pyIsproblem和isProblem，所以用一个公用字段标识质检问题状态

        this.oldOriginalEngName = data.oldOriginalEngName;
        this.newOriginalEngName = data.newOriginalEngName;
        this.oldStandardEngName = data.oldStandardEngName;
        this.newStandardEngName = data.newStandardEngName;
        this.oldOriginalEngAddress = data.oldOriginalEngAddress || '';  // 修改前原始英文地址，
        this.newOriginalEngAddress = data.newOriginalEngAddress || '';  // 预处理英文地址
        this.namesTemp = data.names; // 用于增加names数组时判断namegroupId的控制

        this.addressChi = {};// 大陆地址
        this.addressEng = {};// 英文地址
        this.addressCht = {};// 港澳地址
        this.addressPor = {};// 葡文地址
        if (data.addresses) {
            for (var i = 0, len = data.addresses.length; i < len; i++) {
                var objAdress = new FM.dataApi.ColPoiAddress(data.addresses[i]);
                if (objAdress.langCode == 'CHI') {
                    this.addressChi = objAdress;
                } else if (objAdress.langCode == 'ENG') {
                    this.addressEng = objAdress;
                } else if (objAdress.langCode == 'CHT') {
                    this.addressCht = objAdress;
                } else if (objAdress.langCode == 'POR') {
                    this.addressPor = objAdress;
                }
            }
        }
        // 官方标准
        this.name11Chi = {};
        this.name11Eng = {};
        this.name11Cht = {};
        this.name11Por = {};
        // 官方原始
        this.name12Chi = {};
        this.name12Eng = {};
        this.name12Cht = {};
        this.name12Por = {};

        // 标准化简称
        this.name51ChiArr = [];
        this.name51Chi = {};
        this.name51Eng = {};
        this.name51Cht = {};
        this.name51Por = {};
        // 用于存储所有的有多音字的名称
        this.namePinyin = {};

        // 标准化别名
        this.name31ChiArr = []; // 中文(多个)
        this.name31EngArr = []; // 英文(多个)
        this.name31Chi = {};
        this.name31Eng = {};
        this.name31Cht = {};
        this.name31Por = {};

        // 原始别名
        this.name32ChiArr = []; // 中文(多个)
        this.name32EngArr = []; // 英文(多个)
        this.name32Chi = {};
        this.name32Eng = {};


        // 标准化曾用名
        this.name61ChiArr = [];
        this.name61Chi = {};
        this.name61Eng = {};
        this.name61Cht = {};
        this.name61Por = {};


        if (data.names) {
            for (var j = 0, nameLen = data.names.length; j < nameLen; j++) {
                var obj = new FM.dataApi.ColPoiName(data.names[j]);
                var flag = obj.nameClass + '' + obj.nameType + '' + obj.langCode;
                if (flag == '11CHI') {
                    this.name11Chi = obj;
                } else if (flag === '11ENG') {
                    this.name11Eng = obj;
                } else if (flag === '11CHT') {
                    this.name11Cht = obj;
                } else if (flag === '11POR') {
                    this.name11Por = obj;
                } else if (flag === '12CHI') {
                    this.name12Chi = obj;
                } else if (flag === '12ENG') {
                    this.name12Eng = obj;
                } else if (flag === '12CHT') {
                    this.name12Cht = obj;
                } else if (flag === '12POR') {
                    this.name12Por = obj;
                } else if (flag === '51CHI') {
                    this.name51Chi = obj;
                    this.name51ChiArr.push(obj);
                } else if (flag === '51ENG') {
                    this.name51Eng = obj;
                } else if (flag === '51CHT') {
                    this.name51Cht = obj;
                } else if (flag === '51POR') {
                    this.name51Por = obj;
                } else if (flag === '31CHI') {
                    this.name31Chi = obj;
                    this.name31ChiArr.push(obj);
                } else if (flag === '31ENG') {
                    this.name31Eng = obj;
                    this.name31EngArr.push(obj);
                } else if (flag === '32CHI') {
                    this.name32Chi = obj;
                    this.name32ChiArr.push(obj);
                } else if (flag === '32ENG') {
                    this.name32Eng = obj;
                    this.name32EngArr.push(obj);
                } else if (flag === '61CHI') {
                    this.name61Chi = obj;
                    this.name61ChiArr.push(obj);
                } else if (flag === 'AAA') { // 对拼音的特殊处理,不会存在覆盖的情况，因为每一行只有一个拼音
                    this.namePinyin = obj;
                }
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        var ret = {};
        var i = 0;
        var len = 0;
        ret.pid = this.pid;
        ret.rowId = this.rowId;
        ret.kindCode = this.kindCode;
        ret.classifyRules = this.classifyRules;
        ret.refMsg = this.refMsg;
        // ret.addressList = this.addressList;
        // ret.nameFlag = this.nameFlag;
        ret.attachments = this.attachments;
        ret.meshId = this.meshId;
        ret.detailArea = this.detailArea;
        ret.parentName = this.parentName;
        ret.kindName = this.kindName;
        ret.chainName = this.chainName;
        ret.parentGroupId = this.parentGroupId;
        ret.childrenGroupId = this.childrenGroupId;
        // ret.ckRules = this.ckRules;
        // ret.namerefMsg = this.namerefMsg;


        ret.addresses = [];
        if (!FM.Util.isEmptyObject(this.addressChi)) {
            ret.addresses.push(this.addressChi.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.addressEng)) {
            ret.addresses.push(this.addressEng.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.addressCht)) {
            ret.addresses.push(this.addressCht.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.addressPor)) {
            ret.addresses.push(this.addressPor.getIntegrate());
        }

        ret.names = [];
        if (!FM.Util.isEmptyObject(this.name11Chi)) {
            ret.names.push(this.name11Chi.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.name11Eng)) {
            ret.names.push(this.name11Eng.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.name12Eng)) {
            ret.names.push(this.name12Eng.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.name12Chi)) {
            ret.names.push(this.name12Chi.getIntegrate());
        }
        if (!FM.Util.isEmptyObject(this.namePinyin)) {
            ret.names.push(this.namePinyin.getIntegrate());
        }
        if (this.name51ChiArr.length > 0) {
            for (i = 0, len = this.name51ChiArr.length; i < len; i++) {
                if (this.name51ChiArr[i].rowId === '' && this.name51ChiArr[i].pid === 0) {
                    ret.names.unshift(this.name51ChiArr[i].getIntegrate());
                } else {
                    ret.names.push(this.name51ChiArr[i].getIntegrate());
                }
            }
        }
        if (this.name31ChiArr.length > 0) {
            for (i = 0, len = this.name31ChiArr.length; i < len; i++) {
                if (this.name31ChiArr[i].rowId === '' && this.name31ChiArr[i].pid === 0) {
                    ret.names.unshift(this.name31ChiArr[i].getIntegrate());
                } else {
                    ret.names.push(this.name31ChiArr[i].getIntegrate());
                }
            }
        }
        if (this.name32ChiArr.length > 0) {
            for (i = 0, len = this.name32ChiArr.length; i < len; i++) {
                if (this.name32ChiArr[i].rowId === '' && this.name32ChiArr[i].pid === 0) {
                    ret.names.unshift(this.name32ChiArr[i].getIntegrate());
                } else {
                    ret.names.push(this.name32ChiArr[i].getIntegrate());
                }
            }
        }
        if (this.name61ChiArr.length > 0) {
            for (i = 0, len = this.name61ChiArr.length; i < len; i++) {
                if (this.name61ChiArr[i].rowId === '' && this.name61ChiArr[i].pid === 0) {
                    ret.names.unshift(this.name61ChiArr[i].getIntegrate());
                } else {
                    ret.names.push(this.name61ChiArr[i].getIntegrate());
                }
            }
        }
        if (this.name31EngArr.length > 0) {
            for (i = 0, len = this.name31EngArr.length; i < len; i++) {
                if (this.name31EngArr[i].rowId === '' && this.name31EngArr[i].pid === 0) {
                    ret.names.unshift(this.name31EngArr[i].getIntegrate());
                } else {
                    ret.names.push(this.name31EngArr[i].getIntegrate());
                }
            }
        }
        if (this.name32EngArr.length > 0) {
            for (i = 0, len = this.name32EngArr.length; i < len; i++) {
                if (this.name32EngArr[i].rowId === '' && this.name32EngArr[i].pid === 0) {
                    ret.names.unshift(this.name32EngArr[i].getIntegrate());
                } else {
                    ret.names.push(this.name32EngArr[i].getIntegrate());
                }
            }
        }
        // ret.geoLiveType = this.geoLiveType;
        return ret;
    },
    /**
     * 中文名称转全角
     */
    _chiNameToDBC: function () {
        var i,
            j;
        var names = ['name11Chi', 'name12Chi', 'name31Chi', 'name32Chi'];
        var nameArrs = ['name51ChiArr', 'name31ChiArr', 'name32ChiArr', 'name61ChiArr'];
        var keys = Object.getOwnPropertyNames(this);
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (names.indexOf(key) > -1 && this[key].name) {
                this[key].name = FM.Util.ToDBC(this[key].name);
            }
            if (nameArrs.indexOf(key) > -1) {
                for (j = 0; j < this[key].length; j++) {
                    if (this[key][j].name) {
                        this[key][j].name = FM.Util.ToDBC(this[key][j].name);
                    }
                }
            }
        }
    },
    /**
     * 英文名称转半角
     */
    _engNameToCDB: function () {
        var i;
        if (this.name12Eng && this.name12Eng.name) {
            this.name12Eng.name = FM.Util.ToCDB(this.name12Eng.name);
        }
        if (this.name11Eng && this.name11Eng.name) {
            this.name11Eng.name = FM.Util.ToCDB(this.name11Eng.name);
        }
        if (this.name32EngArr.length > 0) {
            for (i = 0; i < this.name32EngArr.length; i++) {
                if (this.name32EngArr[i].name) {
                    this.name32EngArr[i].name = FM.Util.ToCDB(this.name32EngArr[i].name);
                }
            }
        }
        if (this.name31EngArr.length > 0) {
            for (i = 0; i < this.name31EngArr.length; i++) {
                if (this.name31EngArr[i].name) {
                    this.name31EngArr[i].name = FM.Util.ToCDB(this.name31EngArr[i].name);
                }
            }
        }
    },
    /**
     * 对中文地址的18个字段转全角
     */
    _chiAddressToDBC: function () {
        var i;
        var addArr = ['province', 'city', 'county', 'town', 'place', 'street', 'landmark', 'prefix', 'housenum', 'type', 'subnum', 'surfix', 'estab', 'building', 'floor', 'unit', 'room', 'addons'];
        var keys = Object.getOwnPropertyNames(this.addressChi);
        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (addArr.indexOf(key) > -1) {
                if (this.addressChi[key]) {
                    this.addressChi[key] = FM.Util.ToDBC(this.addressChi[key]);
                }
            }
        }
    },
    /**
     * 对英文地址的18个字段转半角
     */
    _engAddressToCDB: function () {
        if (this.addressEng && this.addressEng.fullname) {
            this.addressEng.fullname = FM.Util.ToCDB(this.addressEng.fullname);
        }
    }
});
