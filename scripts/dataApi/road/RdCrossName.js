/**
 * Created by wangtun on 2016/3/14.
 */
FM.dataApi.RdCrossName = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDCROSSNAME';
        this.pid = data.pid;
        this.nameGroupid = data.nameGroupid || 1;
        this.nameId = data.nameId || 0;
        this.langCode = data.langCode || 'CHI';
        this.name = data.name || '';
        this.phonetic = data.phonetic || '';
        this.phoneticArr = [];
        if (data.phonetic) {
            this.phoneticArr.push(data.phonetic.split(';'));
        }
        this.srcFlag = data.srcFlag || 0;
        this.rowId = data.rowId || null;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.nameGroupid = this.nameGroupid;
//        data["nameId"] = this.nameId;
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
        data.geoLiveType = this.geoLiveType;
        return data;
    },
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.nameGroupid = this.nameGroupid;
//        data["nameId"] = this.nameId;
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
        // data.geoLiveType = this.geoLiveType;
        return data;
    }
});
/** *
 * rdCross中的name初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
FM.dataApi.rdCrossName = function (data, options) {
    return new FM.dataApi.RdCrossName(data, options);
};
