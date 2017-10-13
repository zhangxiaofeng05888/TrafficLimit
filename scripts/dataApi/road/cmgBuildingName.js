/**
 * Created by mali on 2017/5/22.
 */
FM.dataApi.CmgBuildingName = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'CMGBUILDINGNAME';
        this.buildingPid = data.buildingPid;
        this.pid = data.pid;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode || 'CHI';
        this.fullName = data.fullName || '';
        this.baseName = data.baseName || '';
        this.buildNumber = data.buildNumber;
        this.fullNamePhonetic = data.fullNamePhonetic;
        this.fullNamePhoneticArr = [];
        if (data.fullNamePhonetic) {
            this.fullNamePhoneticArr.push(data.fullNamePhonetic.split(';'));
        }
        this.baseNamePhonetic = data.baseNamePhonetic;
        this.baseNamePhoneticArr = [];
        if (data.baseNamePhonetic) {
            this.baseNamePhoneticArr.push(data.baseNamePhonetic.split(';'));
        }
        this.buildNumPhonetic = data.buildNumPhonetic;
        this.buildNumPhoneticArr = [];
        if (data.buildNumPhonetic) {
            this.buildNumPhoneticArr.push(data.buildNumPhonetic.split(';'));
        }
        this.srcFlag = data.srcFlag || 0;
        this.rowId = data.rowId || '';
    },

    /*
     *建筑物名称表
     */
    getIntegrate: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        data.pid = this.pid;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.fullName = this.fullName;
        data.baseName = this.baseName;
        data.buildNumber = this.buildNumber;
        // data.fullNamePhonetic = this.fullNamePhonetic;
        data.fullNamePhonetic = '';
        if (this.fullNamePhoneticArr.length) {
            for (var i = 0; i < this.fullNamePhoneticArr.length; i++) {
                data.fullNamePhonetic += this.fullNamePhoneticArr[i].join(' ') + ' ';
            }
            data.fullNamePhonetic = data.fullNamePhonetic.trim();
        }
        // data.baseNamePhonetic = this.baseNamePhonetic;
        data.baseNamePhonetic = '';
        if (this.baseNamePhoneticArr.length) {
            for (var j = 0; j < this.baseNamePhoneticArr.length; j++) {
                data.baseNamePhonetic += this.baseNamePhoneticArr[j].join(' ') + ' ';
            }
            data.baseNamePhonetic = data.baseNamePhonetic.trim();
        }
        // data.buildNumPhonetic = this.buildNumPhonetic;
        data.buildNumPhonetic = '';
        if (this.buildNumPhoneticArr.length) {
            for (var z = 0; z < this.buildNumPhoneticArr.length; z++) {
                data.buildNumPhonetic += this.buildNumPhoneticArr[z].join(' ') + ' ';
            }
            data.buildNumPhonetic = data.buildNumPhonetic.trim();
        }
        data.srcFlag = this.srcFlag;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.buildingPid = this.buildingPid;
        data.pid = this.pid;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.fullName = this.fullName;
        data.baseName = this.baseName;
        data.buildNumber = this.buildNumber;
        data.fullNamePhonetic = this.fullNamePhonetic;
        data.baseNamePhonetic = this.baseNamePhonetic;
        data.buildNumPhonetic = this.buildNumPhonetic;
        data.srcFlag = this.srcFlag;
        data.rowId = this.rowId;
        return data;
    }

});

FM.dataApi.cmgBuildingName = function (data, options) {
    return new FM.dataApi.CmgBuildingName(data, options);
};
