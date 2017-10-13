/**
 * Created Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoiAddress = FM.dataApi.DataModel.extend({
    dataModelType: 'COL_POI_ADDRESS',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid;
        this.poiPid = data.poiPid || 0;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode;
        this.srcFlag = data.srcFlag;
        this.fullname = data.fullname;
        this.fullnamePhonetic = data.fullnamePhonetic;
        this.roadname = data.roadname;
        this.roadnamePhonetic = data.roadnamePhonetic;
        this.addrname = data.addrname;
        this.addrnamePhonetic = data.addrnamePhonetic;
        this.province = data.province;
        this.city = data.city;
        this.county = data.county;
        this.town = data.town;
        this.place = data.place;
        this.street = data.street;
        this.landmark = data.landmark;
        this.prefix = data.prefix;
        this.housenum = data.housenum;
        this.type = data.type;
        this.subnum = data.subnum;
        this.surfix = data.surfix;
        this.estab = data.estab;
        this.building = data.building;
        this.floor = data.floor;
        this.unit = data.unit;
        this.room = data.room;
        this.addons = data.addons;
        this.provPhonetic = data.provPhonetic;
        this.cityPhonetic = data.cityPhonetic;
        this.countyPhonetic = data.countyPhonetic;
        this.townPhonetic = data.townPhonetic;
        this.placePhonetic = data.placePhonetic;
        this.streetPhonetic = data.streetPhonetic;
        this.landmarkPhonetic = data.landmarkPhonetic;
        this.prefixPhonetic = data.prefixPhonetic;
        this.housenumPhonetic = data.housenumPhonetic;
        this.typePhonetic = data.typePhonetic;
        this.subnumPhonetic = data.subnumPhonetic;
        this.surfixPhonetic = data.surfixPhonetic;
        this.estabPhonetic = data.estabPhonetic;
        this.buildingPhonetic = data.buildingPhonetic;
        this.unitPhonetic = data.unitPhonetic;
        this.floorPhonetic = data.floorPhonetic;
        this.roomPhonetic = data.roomPhonetic;
        this.addonsPhonetic = data.addonsPhonetic;

        this.addrrefMsg = data.addrrefMsg;

        // 拼音
        this.addrnameStr = data.addrnameStr || ''; // 前端编辑拼音时使用（实际来源是后台将PROVINCE、CITY、COUNTY、TOWN、PLACE、STREET字段用竖线分割拼接起来的）
        this.roadnameStr = data.roadnameStr || ''; // 前端编辑拼音时使用（实际来源是后台将LANDMARK、PREFIX、HOUSENUM、TYPE、SUBNUM、SURFIX、ESTAB、BUILDING、UNIT、FLOOR、ROOM、ADDONS字段用竖线分割拼接起来的）
        this.addrnamePhoneticStr = data.addrnamePhoneticStr || '';
        this.roadnamePhoneticStr = data.roadnamePhoneticStr || '';
        this.roadNameMultiPinyin = data.roadNameMultiPinyin;
        this.addrNameMultiPinyin = data.addrNameMultiPinyin;

        this.rowId = data.rowId;

        // 额外的属性
        this.shortNameExtra = '';
    },
    getIntegrate: function () {
        var ret = {};
        ret.pid = this.pid;
        ret.nameGroupid = this.nameGroupid;
        ret.poiPid = this.poiPid;
        ret.langCode = this.langCode;
        ret.srcFlag = this.srcFlag;
        ret.fullname = this.fullname;
        ret.fullnamePhonetic = this.fullnamePhonetic;
        ret.roadname = this.roadname;
        ret.roadnamePhonetic = this.roadnamePhonetic;
        ret.addrname = this.addrname;
        ret.addrnamePhonetic = this.addrnamePhonetic;
        ret.province = this.province;
        ret.city = this.city;
        ret.county = this.county;
        ret.town = this.town;
        ret.place = this.place;
        ret.street = this.street;
        ret.landmark = this.landmark;
        ret.prefix = this.prefix;
        ret.housenum = this.housenum;
        ret.type = this.type;
        ret.subnum = this.subnum;
        ret.surfix = this.surfix;
        ret.estab = this.estab;
        ret.building = this.building;
        ret.floor = this.floor;
        ret.unit = this.unit;
        ret.room = this.room;
        ret.addons = this.addons;
        ret.provPhonetic = this.provPhonetic;
        ret.cityPhonetic = this.cityPhonetic;
        ret.countyPhonetic = this.countyPhonetic;
        ret.townPhonetic = this.townPhonetic;
        ret.placePhonetic = this.placePhonetic;
        ret.streetPhonetic = this.streetPhonetic;
        ret.landmarkPhonetic = this.landmarkPhonetic;
        ret.prefixPhonetic = this.prefixPhonetic;
        ret.housenumPhonetic = this.housenumPhonetic;
        ret.typePhonetic = this.typePhonetic;
        ret.subnumPhonetic = this.subnumPhonetic;
        ret.surfixPhonetic = this.surfixPhonetic;
        ret.estabPhonetic = this.estabPhonetic;
        ret.buildingPhonetic = this.buildingPhonetic;
        ret.floorPhonetic = this.floorPhonetic;
        ret.unitPhonetic = this.unitPhonetic;
        ret.roomPhonetic = this.roomPhonetic;
        ret.addonsPhonetic = this.addonsPhonetic;

        ret.addrrefMsg = this.addrrefMsg;


        // 拼音
        // ret.fullNameMultiPinyin = this.fullNameMultiPinyin;
        // ret.roadNameMultiPinyin = this.roadNameMultiPinyin;
        // ret.fullNamePinyin = this.fullNamePinyin;
        // ret.roadNamePinyin = this.roadNamePinyin;
        // ret.addrNamePinyin = this.addrNamePinyin;
        // ret.addrNameMultiPinyin = this.addrNameMultiPinyin;

        ret.rowId = this.rowId;

        return ret;
    }
});
