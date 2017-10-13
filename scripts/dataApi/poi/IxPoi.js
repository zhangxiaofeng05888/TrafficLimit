/**
 * POI的前端数据模型
 * @class  FM.dataApi.IxPoi
 * @author WuZhen
 * @date   2016-05-27
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.dataApi.IxPoi = FM.dataApi.Feature.extend({
    geoLiveType: 'IXPOI',
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttributes
     * @author WuZhen
     * @date   2016-05-27
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.rowId = data.rowId || '';
        this.kindCode = data.kindCode || '0';
        this.geometry = data.geometry;
        this.xGuide = data.xGuide || 0;
        this.yGuide = data.yGuide || 0;
        this.linkPid = data.linkPid || 0;
        this.side = data.side || 0;
        this.nameGroupid = data.nameGroupid || 0;
        this.roadFlag = data.roadFlag || 0;
        this.pmeshId = data.pmeshId || 0;
        this.importance = data.importance || 0;
        this.chain = data.chain || null;
        this.airportCode = data.airportCode || null;
        this.accessFlag = data.accessFlag || 0;
        this.open24h = data.open24h || 2;
        this.meshId5K = data.meshId5K || null;
        this.meshId = data.meshId || 0;
        this.regionId = data.regionId || 0;
        this.postCode = data.postCode || null;
        this.difGroupid = data.difGroupid || null;
        this.editFlag = data.editFlag || 1;
        this.state = data.state || 0;
        this.fieldState = data.fieldState || null;
        var sportsVenueArr = data.sportsVenue ? data.sportsVenue.split('|') : [];
        this.sportsVenue = {};
        var obj,
            i,
            len;
        for (i = 0; i < sportsVenueArr.length; i++) {
            this.sportsVenue[sportsVenueArr[i]] = true;
        }
        this.type = data.type || 0;
        this.addressFlag = data.addressFlag || 0;
        this.exPriority = data.exPriority || null;
        this.editionFlag = data.editionFlag || null;
        this.poiMemo = data.poiMemo || null;
        this.oldBlockcoed = data.oldBlockcoed || null;
        this.oldName = data.oldName || null;
        this.oldAddress = data.oldAddress || null;
        this.oldKind = data.oldKind || null;
        this.poiNum = data.poiNum || null;
        this.log = data.log || null;
        this.taskId = data.taskId || 0;
        this.dataVersion = data.dataVersion || null;
        this.fieldTaskid = data.fieldTaskid || 0;
        this.verifiedFlag = data.verifiedFlag || 9;
        this.collectTime = data.collectTime || null;
        this.geoAdjustFlag = data.geoAdjustFlag || 9;
        this.fullAttrFlag = data.fullAttrFlag || 9;
        this.truckFlag = data.truckFlag || 0;
        this.level = data.level;
        this.indoor = data.indoor || 0;
        this.freshnessVefication = data.freshVerified;
        this.status = data.status || 0;
        this.uRecord = data.uRecord || 0;
        this.uFields = data.uFields || 0;
        this.uDate = data.uDate || null;
        if (data.icons.length) {
            this.poi3DIcon = true;
        } else {
            this.poi3DIcon = false;
        }
        this.poiRmbIcon = false;
        this.poiCarIcon = false;
        this.poiIcon = false;
        this.vipFlag = data.vipFlag;
        this.rawFields = data.rawFields ? data.rawFields.split('|') : [];


        if (data.vipFlag) {
            var vFlag = data.vipFlag.split('|');
            if (vFlag.length > 1) {
                for (var j = 0, vipLen = vFlag.length - 1; j < vipLen; j++) {
                    if (vFlag[j] == 1) {
                        this.poiRmbIcon = true;
                    } else if (vFlag[j] == 2) {
                        this.poiCarIcon = true;
                    } else if (vFlag[j] == 3) {
                        this.poiIcon = true;
                    }
                }
            }
        }
        this.guide = {
            type: 'Point',
            coordinates: [
                data.xGuide, data.yGuide
            ]
        };
        this.guideLink = {
            type: 'LineString',
            coordinates: [[data.xGuide, data.yGuide], data.geometry.coordinates]
        };
        this.kindFormat = [];
        this.name = {}; // 主名称
        this.names = [];
        if (data.names) {
            for (var p = 0; p < data.names.length; p++) {
                obj = new FM.dataApi.IxPoiName(data.names[p]);
                this.names.push(obj);
            }
        }
        this.address = {}; // 主地址
        this.addresses = [];
        if (data.addresses) {
            for (var q = 0, qLen = data.addresses.length; q < qLen; q++) {
                obj = new FM.dataApi.IxPoiAddress(data.addresses[q]);
                this.addresses.push(obj);
            }
        }
        this.contactParts = null;// 存放手机和座机
        this.contacts = [];
        if (data.contacts) {
            for (i = 0, len = data.contacts.length; i < len; i++) {
                this.contacts.push(new FM.dataApi.IxPoiContact(data.contacts[i]));
            }
        }
        this.photos = [];
        if (data.photos) {
            for (i = 0, len = data.photos.length; i < len; i++) {
                this.photos.push(new FM.dataApi.IxPoiPhoto(data.photos[i]));
            }
        }
        this.children = [];
        if (data.children) {
            for (i = 0, len = data.children.length; i < len; i++) {
                this.children.push(new FM.dataApi.IxPoiChildren(data.children[i]));
            }
        }
        this.parents = [];
        if (data.parents) {
            for (i = 0, len = data.parents.length; i < len; i++) {
                this.parents.push(new FM.dataApi.IxPoiParent(data.parents[i]));
            }
        }
        this.buildings = [];
        if (data.buildings) {
            for (i = 0, len = data.buildings.length; i < len; i++) {
                this.buildings.push(new FM.dataApi.IxPoiBuilding(data.buildings[i]));
            }
        }
        this.businesstimes = [];
        if (data.businesstimes) {
            for (i = 0, len = data.businesstimes.length; i < len; i++) {
                this.businesstimes.push(new FM.dataApi.IxPoiBusinesstime(data.businesstimes[i]));
            }
        }
        this.carrentals = [];
        if (data.carrentals) {
            for (i = 0, len = data.carrentals.length; i < len; i++) {
                this.carrentals.push(new FM.dataApi.IxPoiCarRental(data.carrentals[i]));
            }
        }
        this.details = [];
        if (data.details) {
            for (i = 0, len = data.details.length; i < len; i++) {
                this.details.push(new FM.dataApi.IxPoiDetail(data.details[i]));
            }
        }
        this.gasstations = [];
        this.oilstations = [];
        if (data.gasstations) {
            for (i = 0, len = data.gasstations.length; i < len; i++) {
                if (data.kindCode == '230215') { // 加油站
                    this.oilstations.push(new FM.dataApi.IxPoiOilstation(data.gasstations[i]));
                } else { // 加气站
                    this.gasstations.push(new FM.dataApi.IxPoiGasstation(data.gasstations[i]));
                }
            }
        }
        this.hotels = [];
        if (data.hotels) {
            for (i = 0, len = data.hotels.length; i < len; i++) {
                this.hotels.push(new FM.dataApi.IxPoiHotel(data.hotels[i]));
            }
        }
        this.restaurants = [];
        if (data.restaurants) {
            for (i = 0, len = data.restaurants.length; i < len; i++) {
                this.restaurants.push(new FM.dataApi.IxPoiRestaurant(data.restaurants[i]));
            }
        }
        this.parkings = [];
        if (data.parkings) {
            for (i = 0, len = data.parkings.length; i < len; i++) {
                this.parkings.push(new FM.dataApi.IxPoiParking(data.parkings[i]));
            }
        }
        this.chargingstations = [];
        if (data.chargingstations) {
            for (i = 0, len = data.chargingstations.length; i < len; i++) {
                this.chargingstations.push(new FM.dataApi.IxPoiChargingstation(data.chargingstations[i]));
            }
        }
        this.chargingplots = [];
        if (data.chargingplots) {
            for (i = 0, len = data.chargingplots.length; i < len; i++) {
                this.chargingplots.push(new FM.dataApi.IxPoiChargingplot(data.chargingplots[i]));
            }
        }
        this.samePois = [];
        if (data.samePois) {
            for (i = 0, len = data.samePois.length; i < len; i++) {
                this.samePois.push(new FM.dataApi.IxSamepoi(data.samePois[i]));
            }
        }
        this.samepoiParts = [];
        if (data.samepoiParts) {
            for (i = 0, len = data.samepoiParts.length; i < len; i++) {
                this.samepoiParts.push(new FM.dataApi.IxSamepoiPart(data.samepoiParts[i]));
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        this._clearDeepInfo();
        this._formatNameAndAddress();
        // this._clearEmptyContacts();
        this._formatContacts();
        var ret = {};
        ret.pid = this.pid;
        ret.rowId = this.rowId;
        ret.kindCode = this.kindCode == '0' ? '' : this.kindCode;
        ret.side = this.side;
        ret.nameGroupid = this.nameGroupid;
        ret.roadFlag = this.roadFlag;
        ret.pmeshId = this.pmeshId;
        ret.importance = this.importance;
        ret.chain = this.chain ? this.chain : '';
        ret.airportCode = this.airportCode;
        ret.accessFlag = this.accessFlag;
        ret.open24h = this.open24h;
        ret.meshId5K = this.meshId5K;
        ret.meshId = this.meshId;
        ret.regionId = this.regionId;
        ret.postCode = this.postCode;
        ret.difGroupid = this.difGroupid;
        ret.editFlag = this.editFlag;
        ret.state = this.state;
        ret.fieldState = this.fieldState;
        var sportsVenueArr = [];
        for (var key in this.sportsVenue) {
            if (this.sportsVenue[key]) {
                sportsVenueArr.push(key);
            }
        }
        ret.sportsVenue = sportsVenueArr.join('|').substr(0, 3);
        ret.type = this.type;
        ret.addressFlag = this.addressFlag;
        ret.exPriority = this.exPriority;
        ret.editionFlag = this.editionFlag;
        ret.poiMemo = this.poiMemo;
        ret.oldBlockcoed = this.oldBlockcoed;
        ret.oldName = this.oldName;
        ret.oldAddress = this.oldAddress;
        ret.oldKind = this.oldKind;
        ret.poiNum = this.poiNum;
        ret.log = this.log;
        ret.taskId = this.taskId;
        ret.dataVersion = this.dataVersion;
        ret.fieldTaskid = this.fieldTaskid;
        ret.verifiedFlag = this.verifiedFlag;
        ret.collectTime = this.collectTime;
        ret.geoAdjustFlag = this.geoAdjustFlag;
        ret.fullAttrFlag = this.fullAttrFlag;
        ret.truckFlag = this.truckFlag;
        ret.level = this.level;
        ret.indoor = this.indoor;
        ret.vipFlag = this.vipFlag;
        ret.freshnessVefication = this.freshnessVefication;
        ret.status = this.status;
        ret.uRecord = this.uRecord;
        this._attrToDBC();
        ret.names = [];
        var i,
            len;
        if (this.names) {
            for (i = 0, len = this.names.length; i < len; i++) {
                ret.names.push(this.names[i].getIntegrate());
            }
        }
        ret.addresses = [];
        if (this.addresses) {
            for (i = 0, len = this.addresses.length; i < len; i++) {
                ret.addresses.push(this.addresses[i].getIntegrate());
            }
        }
        ret.contacts = [];
        if (this.contacts) {
            for (i = 0, len = this.contacts.length; i < len; i++) {
                ret.contacts.push(this.contacts[i].getIntegrate());
            }
        }
        ret.photos = [];
        if (this.photos) {
            for (i = 0, len = this.photos.length; i < len; i++) {
                ret.photos.push(this.photos[i].getIntegrate());
            }
        }
        ret.children = [];
        if (this.children) {
            for (i = 0, len = this.children.length; i < len; i++) {
                ret.children.push(this.children[i].getIntegrate());
            }
        }
        ret.parents = [];
        if (this.parents) {
            for (i = 0, len = this.parents.length; i < len; i++) {
                ret.parents.push(this.parents[i].getIntegrate());
            }
        }
        ret.buildings = [];
        if (this.buildings) {
            for (i = 0, len = this.buildings.length; i < len; i++) {
                ret.buildings.push(this.buildings[i].getIntegrate());
            }
        }
        ret.businesstimes = [];
        if (this.businesstimes) {
            for (i = 0, len = this.businesstimes.length; i < len; i++) {
                ret.businesstimes.push(this.businesstimes[i].getIntegrate());
            }
        }
        ret.carrentals = [];
        if (this.carrentals) {
            for (i = 0, len = this.carrentals.length; i < len; i++) {
                ret.carrentals.push(this.carrentals[i].getIntegrate());
            }
        }
        ret.details = [];
        if (this.details) {
            for (i = 0, len = this.details.length; i < len; i++) {
                ret.details.push(this.details[i].getIntegrate());
            }
        }
        ret.gasstations = [];
        if (this.kindCode == '230215' && this.oilstations) { // 加油站
            for (i = 0, len = this.oilstations.length; i < len; i++) {
                ret.gasstations.push(this.oilstations[i].getIntegrate());
            }
        } else if (this.kindCode == '230216' && this.gasstations) { // 加气站
            for (i = 0, len = this.gasstations.length; i < len; i++) {
                ret.gasstations.push(this.gasstations[i].getIntegrate());
            }
        }
        ret.hotels = [];
        if (this.hotels) {
            for (i = 0, len = this.hotels.length; i < len; i++) {
                ret.hotels.push(this.hotels[i].getIntegrate());
            }
        }
        ret.restaurants = [];
        if (this.restaurants) {
            for (i = 0, len = this.restaurants.length; i < len; i++) {
                ret.restaurants.push(this.restaurants[i].getIntegrate());
            }
        }
        ret.parkings = [];
        if (this.parkings) {
            for (i = 0, len = this.parkings.length; i < len; i++) {
                ret.parkings.push(this.parkings[i].getIntegrate());
            }
        }
        ret.chargingstations = [];
        if (this.chargingstations) {
            for (i = 0, len = this.chargingstations.length; i < len; i++) {
                ret.chargingstations.push(this.chargingstations[i].getIntegrate());
            }
        }
        ret.chargingplots = [];
        if (this.chargingplots) {
            for (i = 0, len = this.chargingplots.length; i < len; i++) {
                ret.chargingplots.push(this.chargingplots[i].getIntegrate());
            }
        }
        ret.samePois = [];
        if (this.samePois) {
            for (i = 0, len = this.samePois.length; i < len; i++) {
                ret.samePois.push(this.samePois[i].getIntegrate());
            }
        }
        ret.samepoiParts = [];
        if (this.samepoiParts) {
            for (i = 0, len = this.samepoiParts.length; i < len; i++) {
                ret.samepoiParts.push(this.samepoiParts[i].getIntegrate());
            }
        }
        // ret.geoLiveType = this.geoLiveType;
        return ret;
    },
    /**
     * 部分属性转全角
     */
    _attrToDBC: function () {
        if (this.name.name) {
            this.name.name = FM.Util.ToDBC(this.name.name);
        }
        if (this.address.fullname) {
            this.address.fullname = FM.Util.ToDBC(this.address.fullname);
        }
    },

    /**
     * 判断对象为空或者属性的值都是false
     * @param obj
     * @returns {boolean}
     * @private
     */
    _emptyOrAllFalse: function (obj) {
        var flag = true;
        if (FM.Util.isEmptyObject(obj)) {
            return flag;
        }
        for (var o in obj) {
            if (obj.hasOwnProperty(o)) {
                if (obj[o]) {
                    flag = false;
                    break;
                }
            }
        }
        return flag;
    },

    // 重写的基类的方法
    _doValidate: function () {
        if (this.address.fullname && this.address.fullname.length == 1) {
            this._pushError('name', '地址的长度不能为1！');
        }
        if (['230210', '230213', '230214'].indexOf(this.kindCode) > -1) { // 停车场、换乘停车场、货车专用停车场
            if (this.parkings[0].totalNum == undefined) {
                this._pushError('totalNum', '车位数有误，请检查！');
            }
            if (!this.parkings[0].parkingType) { // 值域 1-4
                this._pushError('parkingType', '深度信息"类型"为必填项!');
            }
        }
        if (this.kindCode === '230215') { // 加油站 IxPoiOilstation
            if (this._emptyOrAllFalse(this.oilstations[0].oilType) &&
                this._emptyOrAllFalse(this.oilstations[0].egType) &&
                this._emptyOrAllFalse(this.oilstations[0].mgType) &&
                this._emptyOrAllFalse(this.oilstations[0].fuelType)) {
                this._pushError('type', '"汽油、甲醇汽油、乙醇汽油、燃料类型"至少填一项!');
            }
        }
        if (this.kindCode === '230216') { // 加气站
            if (this._emptyOrAllFalse(this.gasstations[0].fuelType)) {
                this._pushError('type', '"燃料类型"为必填项!');
            }
        }
        if (this.kindCode === '230218') { // 充电站
            if (!this.chargingstations[0].chargingType) {
                this.chargingstations[0].chargingType = 3; // 特殊需求，保存时如果充电站类型字段没有赋值，则默认赋值3
            }
        }
        if (this.kindCode === '230227') { // 充电桩
            if (this.chargingplots.length === 2 &&
                this.chargingplots[0].acdc == this.chargingplots[1].acdc) {
                this._pushError('acdc', '两条深度信息的电流类型相同!');
            }
        }
        if (this.kindCode === '230227') { // 充电桩
            if (this.chargingplots.length === 2 &&
                this.chargingplots[0].acdc == this.chargingplots[1].acdc) {
                this._pushError('acdc', '两条深度信息的电流类型相同!');
            }
        }
        if (['180104', '180106', '180101', '180102', '180111'].indexOf(this.kindCode) > -1) {
            if (this._emptyOrAllFalse(this.sportsVenue)) {
                this._pushError('type', '深度信息"场馆类型"为必填项!');
            }
        } else {
            this.sportsVenue = {};
        }
    },
    _clearDeepInfo: function () {
        var kindCode = this.kindCode;
        var data = this.kindFormat[kindCode];
        if (data) {
            switch (data.extend) {
                case 1: // 停车场
                    this.gasstations = [];
                    this.oilstations = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    break;
                case 2: // 加油站
                    this.parkings = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    this.gasstations = [];
                    break;
                case 3: // 充电站
                    this.parkings = [];
                    this.gasstations = [];
                    this.oilstations = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingplots = [];
                    break;
                case 4: // 宾馆酒店
                    this.parkings = [];
                    this.gasstations = [];
                    this.oilstations = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    break;
                case 5: // 运动场馆 由于运动场馆深度信息没有子表，使用的是poi的label字段，所以需要和default一样的处理方式
                    this.parkings = [];
                    this.gasstations = [];
                    this.oilstations = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    break;
                case 6: // 餐馆
                    this.parkings = [];
                    this.gasstations = [];
                    this.oilstations = [];
                    this.hotels = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    break;
                case 7: // 加气站
                    this.parkings = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    this.oilstations = [];
                    break;
                case 9: // 充电桩
                    this.parkings = [];
                    this.gasstations = [];
                    this.oilstations = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    break;
                default:
                    this.parkings = [];
                    this.gasstations = [];
                    this.oilstations = [];
                    this.hotels = [];
                    this.restaurants = [];
                    this.chargingstations = [];
                    this.chargingplots = [];
                    break;
            }
        }

        // 需求--当分类为加油站，并且open14h为1时，需要将gasstations中的openHour字段赋值为“00:00-24:00”
        if (this.kindCode == '230215' && this.open24h == 1) {
            if (this.oilstations && this.oilstations.length > 0) {
                this.oilstations[0].openHour = FM.Util.ToDBC('00:00-24:00');
            }
        }
    },

    _formatNameAndAddress: function () {
        // 21CHI为空时,增加名称的控制
        var flag = true;
        var i,
            len;
        if (!FM.Util.isEmptyObject(this.name)) {
            for (i = 0, len = this.names.length; i < len; i++) {
                if (this.name.langCode == this.names[i].langCode && this.name.nameClass == this.names[i].nameClass && this.name.nameType == this.names[i].nameType) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                this.names.unshift(this.name);
            }
        }
        // 增加对CHI地址为空的控制
        flag = true;
        if (!FM.Util.isEmptyObject(this.name)) {
            var addIndex = -1;
            for (i = 0; i < this.addresses.length; i++) {
                if (this.address.langCode == this.addresses[i].langCode) {
                    flag = false;
                    addIndex = i;
                    break;
                }
            }
            if (flag) {
                if (this.address.fullname) { // 当fullname不为空时在增加地址对象
                    this.addresses.unshift(this.address);
                }
            } else if (!this.address.fullname) { // 当从编辑页面把fullname字段删除后，需要清除address对象
                this.addresses.splice(addIndex, 1);
            }
        }
    },

    // 用编辑的手机和座机替换原有的手机和座机
    _formatContacts: function () {
        if (this.contactParts) {
            for (var i = this.contacts.length - 1; i >= 0; i--) {
                if (this.contacts[i].contactType == 1 || this.contacts[i].contactType == 2) {
                    this.contacts.splice(i, 1);
                }
            }
            for (var j = 0; j < this.contactParts.length; j++) {
                if (this.contactParts[j].contact) {
                    this.contacts.push(this.contactParts[j]);
                }
            }
        }
    },

    getSnapShot: function () { // 这样写的原因是为了返回的UI对象
        return new FM.dataApi.IxPoiSnapShot(this.getIntegrate());
    }
});
