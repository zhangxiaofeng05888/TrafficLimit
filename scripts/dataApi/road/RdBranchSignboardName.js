/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchSignBoardName = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHSIGNBOARDNAME';
        this.pid = data.pid || 0;
        this.rowId = data.rowId || null;
        this.seqNum = data.seqNum || 1;
        this.nameGroupid = data.nameGroupid || 1;
        this.signboardId = data.signboardId;
        this.nameClass = data.nameClass || 0;
        this.langCode = data.langCode || 'CHI';
        this.codeType = data.codeType || 0;
        this.name = data.name || '';
        this.phonetic = data.phonetic || '';
        this.phoneticArr = [];
        if (data.phonetic) {
            this.phoneticArr.push(data.phonetic.split(';'));
        }
        this.voiceFile = data.voiceFile || '';
        this.srcFlag = data.srcFlag || 0;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.seqNum = this.seqNum;
        data.nameGroupid = this.nameGroupid;
        data.signboardId = this.signboardId;
        data.nameClass = this.nameClass;
        data.langCode = this.langCode;
        data.codeType = this.codeType;
        data.name = this.name;
        // data.phonetic = this.phonetic;
        data.phonetic = '';
        if (this.phoneticArr.length) {
            for (var i = 0; i < this.phoneticArr.length; i++) {
                data.phonetic += this.phoneticArr[i].join(' ') + ' ';
            }
            data.phonetic = data.phonetic.trim();
        }
        data.voiceFile = this.voiceFile;
        data.srcFlag = this.srcFlag;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.seqNum = this.seqNum;
        data.nameGroupid = this.nameGroupid;
        data.signboardId = this.signboardId;
        data.nameClass = this.nameClass;
        data.langCode = this.langCode;
        data.codeType = this.codeType;
        data.name = this.name;
        // data.phonetic = this.phonetic;
        data.phonetic = '';
        if (this.phoneticArr.length) {
            for (var i = 0; i < this.phoneticArr.length; i++) {
                data.phonetic += this.phoneticArr[i].join(' ') + ' ';
            }
            data.phonetic = data.phonetic.trim();
        }
        data.voiceFile = this.voiceFile;
        data.srcFlag = this.srcFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

FM.dataApi.rdBranchSignBoardName = function (data, options) {
    return new FM.dataApi.RdBranchSignBoardName(data, options);
};
