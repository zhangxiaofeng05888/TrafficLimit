/**
 * Created by zhaohang on 2016/4/5.
 */
FM.dataApi.AdAdminName = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'ADADMINNAME';
        this.pid = data.pid || 0;
        this.rowId = data.rowId || '';
        this.regionId = data.regionId || 0;
        this.nameId = data.nameId || 0;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode || 'CHI';
        this.nameClass = data.nameClass || 1;
        this.name = data.name || '';
        this.phonetic = data.phonetic || '';
        this.phoneticArr = [];
        if (data.phonetic) {
            this.phoneticArr.push(data.phonetic.split(';'));
        }
        this.srcFlag = data.srcFlag || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.regionId = this.regionId;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.nameClass = this.nameClass;
        data.name = this.name;
        // data.phonetic = this.phonetic;
        data.phonetic = '';
        if (this.phoneticArr.length) {
            for (var i = 0; i < this.phoneticArr.length; i++) {
                data.phonetic += this.phoneticArr[i].join(' ') + ' ';
            }
            data.phonetic = data.phonetic.trim();
        }
        data.srcFlag = this.srcFlag;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.regionId = this.regionId;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.nameClass = this.nameClass;
        data.name = this.name;
        // data.phonetic = this.phonetic;
        data.phonetic = '';
        if (this.phoneticArr.length) {
            for (var i = 0; i < this.phoneticArr.length; i++) {
                data.phonetic += this.phoneticArr[i].join(' ') + ' ';
            }
            data.phonetic = data.phonetic.trim();
        }
        data.srcFlag = this.srcFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    }

});

FM.dataApi.adAdminName = function (data, options) {
    return new FM.dataApi.AdAdminName(data, options);
};
