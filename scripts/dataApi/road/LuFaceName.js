/**
 * Created by mali on 2016/7/27.
 */
FM.dataApi.LuFaceName = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'LUFACENAME';
        this.rowId = data.rowId || null;
        this.pid = data.pid;
        this.facePid = data.facePid;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode || 'CHI';
        this.name = data.name || '';
        this.phonetic = data.phonetic || '';
        this.phoneticArr = [];
        if (data.phonetic) {
            this.phoneticArr.push(data.phonetic.split(';'));
        }
        this.srcFlag = data.srcFlag || 0;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.facePid = this.facePid;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
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
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.facePid = this.facePid;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
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
        data.rowId = this.rowId;
        return data;
    }
});

FM.dataApi.luFaceName = function (data, options) {
    return new FM.dataApi.LuFaceName(data, options);
};
