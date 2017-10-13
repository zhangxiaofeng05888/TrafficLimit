/**
 * Created by wuz on 2017/6/5.
 */
FM.dataApi.AgentPoi = FM.dataApi.Feature.extend({
    geoLiveType: 'AGENT_POI',
    /*
     * DB-->UI
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this.rowId = data.rowId || '';
        this.poiNum = data.poiNum || null;
        this.kindCode = data.kindCode || '0';
        this.chain = data.chain || '';
        this.level = data.level || '';
        this.postCode = data.postCode || '';
        this.open24h = data.open24h || 2;
        this.geometry = { // 这样写是为了解决修改坐标时对象引用的问题
            type: data.geometry.type,
            coordinates: [data.geometry.coordinates[0], data.geometry.coordinates[1]]
        };
        this.xGuide = data.xGuide || 0;
        this.yGuide = data.yGuide || 0;
        this.regionId = data.regionId || 0;
        this.meshId = data.meshId || 0;
        this.status = data.status;

        var obj;
        this.names = [];
        if (data.names) {
            for (var p = 0; p < data.names.length; p++) {
                obj = new FM.dataApi.AgentPoiName(data.names[p]);
                this.names.push(obj);
            }
        }
        this.name = {}; // 官方标准中文名
        this.nameShort = {}; // 简称

        this.address = {}; // 地址
        this.addresses = [];
        if (data.addresses) {
            for (var q = 0, qLen = data.addresses.length; q < qLen; q++) {
                obj = new FM.dataApi.AgentPoiAddress(data.addresses[q]);
                this.addresses.push(obj);
            }
        }
        this.contacts = [];
        if (data.contacts) {
            for (var i = 0, len = data.contacts.length; i < len; i++) {
                this.contacts.push(new FM.dataApi.AgentPoiContact(data.contacts[i]));
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function () {
        this._attrToDBC();
        this._formatNameAndAddress();
        var ret = {};
        ret.pid = this.pid;
        ret.rowId = this.rowId;
        ret.poiNum = this.poiNum;
        ret.kindCode = this.kindCode == '0' ? '' : this.kindCode;
        ret.chain = this.chain;
        ret.level = this.level;
        ret.postCode = this.postCode;
        ret.open24h = this.open24h;
        // ret.geometry = this.geometry;
        ret.geometry = {
            type: this.geometry.type,
            coordinates: [this.geometry.coordinates[0], this.geometry.coordinates[1]]
        };
        ret.xGuide = this.xGuide;
        ret.yGuide = this.yGuide;
        ret.regionId = this.regionId;
        ret.meshId = this.meshId;
        ret.status = this.status;

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
        if (this.nameShort.name) {
            this.nameShort.name = FM.Util.ToDBC(this.nameShort.name);
        }
        if (this.address.fullname) {
            this.address.fullname = FM.Util.ToDBC(this.address.fullname);
        }
    },
    // 重写的基类的方法
    _doValidate: function () {
        // if (this.address.fullname && this.address.fullname.length == 1) {
        //     this._pushError('name', '地址的长度不能为1！');
        // }
    },

    _formatNameAndAddress: function () {
        var flag = true;
        var i,
            len;
        // 官方标准中文名
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
        // 简称
        flag = true;
        if (!FM.Util.isEmptyObject(this.nameShort)) {
            var nameShortIndex = -1;
            for (i = 0, len = this.names.length; i < len; i++) {
                if (this.nameShort.langCode == this.names[i].langCode && this.nameShort.nameClass == this.names[i].nameClass && this.nameShort.nameType == this.names[i].nameType) {
                    flag = false;
                    nameShortIndex = i;
                    break;
                }
            }
            if (flag) {
                if (this.nameShort.name) {
                    this.names.unshift(this.nameShort);
                }
            } else {
                if (!this.nameShort.name) {
                    this.names.splice(nameShortIndex, 1);
                }
            }
        }
        // 增加对CHI地址为空的控制
        flag = true;
        if (!FM.Util.isEmptyObject(this.address)) {
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

    // 重写父类的方法，主要是为了解决新增时不传递pid，rowid，poipid等字段
    _compareJson: function (newJson, oldJson) {
        var changed = {};
        var newVal,
            oldVal,
            tempObj,
            tempArray;
        var k,
            i,
            j,
            delFlag;
        if (newJson && !oldJson) { // 新增
            for (k in newJson) {
                if (newJson.hasOwnProperty(k) && k !== 'geometry') {
                    newVal = newJson[k];
                    if (typeof newVal === 'object') {
                        if (FM.Util.isObject(newVal)) {
                            tempObj = this._compareJson(newVal, null);
                            if (tempObj) {
                                changed[k] = tempObj;
                            }
                        } else if (FM.Util.isArray(newVal)) {
                            tempArray = [];
                            for (i = 0; i < newVal.length; i++) {
                                tempObj = this._compareJson(newVal[i], null);
                                if (tempObj) {
                                    tempArray.push(tempObj);
                                }
                            }
                            if (tempArray.length > 0) {
                                changed[k] = tempArray;
                            }
                        }
                    } else {
                        changed[k] = newVal;
                    }
                }
            }
            delete changed.pid;
            delete changed.poiPid;
            delete changed.rowId;
            changed.objStatus = 'INSERT';
        } else if (!newJson && oldJson) { // 删除
            for (k in oldJson) {
                if (oldJson.hasOwnProperty(k) && k !== 'geometry') {
                    oldVal = oldJson[k];
                    if (typeof oldVal === 'object') {
                        if (FM.Util.isObject(oldVal)) {
                            tempObj = this._compareJson(null, oldVal);
                            if (tempObj) {
                                changed[k] = tempObj;
                            }
                        } else if (FM.Util.isArray(oldVal)) {
                            tempArray = [];
                            for (i = 0; i < oldVal.length; i++) {
                                tempObj = this._compareJson(null, oldVal[i]);
                                if (tempObj) {
                                    tempArray.push(tempObj);
                                }
                            }
                            if (tempArray.length > 0) {
                                changed[k] = tempArray;
                            }
                        }
                    } else if (k === 'rowId' || k === 'pid' || k === 'linkPid' || k === 'nodePid' || k === 'formOfWay') {
                        changed[k] = oldJson[k];
                    }
                }
            }
            changed.objStatus = 'DELETE';
        } else { // 修改
            for (k in newJson) {
                // 不比较几何坐标
                if (newJson.hasOwnProperty(k) && k !== 'geometry') {
                    newVal = newJson[k];
                    oldVal = oldJson[k];
                    if (typeof newVal === 'object') {
                        if (FM.Util.isObject(newVal) && FM.Util.isObject(oldVal)) {
                            tempObj = this._compareJson(newVal, oldVal);
                            if (tempObj) {
                                changed[k] = tempObj;
                            }
                        } else if (FM.Util.isArray(newVal) && FM.Util.isArray(oldVal)) {
                            tempArray = [];
                            for (i = 0; i < newVal.length; i++) {
                                tempObj = null;
                                if (newVal[i].hasOwnProperty('rowId') && newVal[i].rowId) { // 修改
                                    for (j = 0; j < oldVal.length; j++) {
                                        if (newVal[i].rowId === oldVal[j].rowId) {
                                            tempObj = this._compareJson(newVal[i], oldVal[j]);
                                            // 增加返回optins属性，主要为了批量编辑
                                            if (newVal[i].options && newVal[i].options.correspondingArr && tempObj) {
                                                tempObj.options = oldVal[j].options;
                                            }
                                            break;
                                        }
                                    }
                                } else { // 新增
                                    tempObj = this._compareJson(newVal[i], null);
                                }
                                if (tempObj) {
                                    tempArray.push(tempObj);
                                }
                            }
                            for (i = 0; i < oldVal.length; i++) { // 删除
                                delFlag = true;
                                for (j = 0; j < newVal.length; j++) {
                                    if (newVal[j].rowId === oldVal[i].rowId) {
                                        delFlag = false;
                                        break;
                                    }
                                }
                                if (delFlag) {
                                    tempObj = this._compareJson(null, oldVal[i]);
                                    if (tempObj) {
                                        tempArray.push(tempObj);
                                    }
                                }
                            }
                            if (tempArray.length > 0) {
                                changed[k] = tempArray;
                            }
                        }
                    } else if (newVal !== oldVal) {
                        changed[k] = newVal;
                    }
                }
            }
            if (!FM.Util.isEmptyObject(changed)) {
                if (newJson.hasOwnProperty('rowId')) {
                    changed.rowId = newJson.rowId;
                }
                if (newJson.hasOwnProperty('pid') && !changed.hasOwnProperty('pid')) {
                    changed.pid = newJson.pid;
                }
                if (newJson.hasOwnProperty('linkPid') && !changed.hasOwnProperty('linkPid')) {
                    changed.linkPid = newJson.linkPid;
                }
                changed.objStatus = 'UPDATE';
            }
        }
        if (FM.Util.isEmptyObject(changed)) { // 如果没有任何变化，则返回null
            return null;
        }
        return changed;
    }
});
