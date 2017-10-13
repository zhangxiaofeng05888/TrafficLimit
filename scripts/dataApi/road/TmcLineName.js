/**
 * Created by wangmingdong on 2016/11/21.
 * Class TmcLineName
 */

FM.dataApi.TmcLineName = FM.dataApi.Feature.extend({

    setAttributes: function (data) {
        this.geoLiveType = 'TMCLINETRANSLATENAME';
        this.tmcId = data.tmcId;
        this.nameFlag = data.nameFlag;
        this.transLang = data.transLang;
        this.translateName = data.translateName;
        this.phonetic = data.phonetic;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取TmcLineName简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.tmcId = this.tmcId;
        data.nameFlag = this.nameFlag;
        data.transLang = this.transLang;
        data.translateName = this.translateName;
        data.phonetic = this.phonetic;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取TmcLineName详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.tmcId = this.tmcId;
        data.nameFlag = this.nameFlag;
        data.transLang = this.transLang;
        data.translateName = this.translateName;
        data.phonetic = this.phonetic;
        // data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * TmcLineName初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
FM.dataApi.tmcLineName = function (data, options) {
    return new FM.dataApi.TmcLineName(data, options);
};
