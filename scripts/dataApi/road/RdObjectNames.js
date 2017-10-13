/**
 * Created by liuyang on 2015/9/9.
 * Class RdObjectNames
 */

FM.dataApi.RdObjectNames = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'RDOBJECTNAME';
        this.nameId = data.nameId || 0;
        this.pid = data.pid || 0;
        this.nameGroupid = data.nameGroupid || 1;
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

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
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
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
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
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
FM.dataApi.rdObjectNames = function (data, options) {
    return new FM.dataApi.RdObjectNames(data, options);
};

