/**
 * Created by wangtun on 2016/3/15.
 */
FM.dataApi.RdBranchName = FM.dataApi.Feature.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'RDBRANCHNAME';
        this.pid = data.pid || 0;
        this.rowId = data.rowId || null;
        this.seqNum = data.seqNum || 1;
        this.nameGroupid = data.nameGroupid || 1;
        this.detailId = data.detailId;
        this.nameClass = data.nameClass || 0;
        this.langCode = data.langCode || 'CHI';
        this.codeType = data.codeType || 0;
        this.name = data.name || '';
        this.phonetic = data.phonetic || '';
        this.phoneticArr = [];
        if (data.phonetic) {
            this.phoneticArr.push(data.phonetic.split(';'));
        }
        this.srcFlag = data.srcFlag || 0;
        this.voiceFile = data.voiceFile || '';
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.seqNum = this.seqNum;
        data.nameGroupid = this.nameGroupid;
        data.detailId = this.detailId;
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
        data.srcFlag = this.srcFlag;
        data.voiceFile = this.voiceFile;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.seqNum = this.seqNum;
        data.nameGroupid = this.nameGroupid;
        data.detailId = this.detailId;
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
        data.srcFlag = this.srcFlag;
        data.voiceFile = this.voiceFile;
        return data;
    }
});
/** *
 * rdBranchName 名字初始化函数
 * @param data 分歧名字数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdBranchName}
 */
FM.dataApi.rdBranchName = function (data, options) {
    return new FM.dataApi.RdBranchName(data, options);
};
