/**
 * Created by mali on 2017/4/19.
 */
FM.dataApi.ScModelMatchG = FM.dataApi.Feature.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'SCMODELMATCHG';
        this.pid = data.pid || null;
        this.fileId = data.fileId || null;
        this.productLine = data.productLine || '';
        this.version = data.version || '';
        this.projectNm = data.projectNm || '';
        this.specification = data.specification || '';
        this.bType = data.bType || '';
        this.mType = data.mType || '';
        this.sType = data.sType || '';
        this.fileName = data.fileName || '';
        this.size = data.size || '';
        this.format = data.format || '';
        this.impWorker = data.impWorker || '';
        this.impDate = data.impDate || null;
        this.urlDb = data.urlDb || '';
        this.urlFile = data.urlFile || '';
        this.memo = data.memo || '';
        this.fileContent = data.fileContent || null;
        this.updateTime = data.updateTime || '';
    },

    /*
     *获取的道路名信息
     */
    getIntegrate: function () {
        var data = {};
        data.fileId = this.fileId;
        data.productLine = this.productLine;
        data.version = this.version;
        data.projectNm = this.projectNm;
        data.specification = this.specification;
        data.bType = this.bType;
        data.mType = this.mType;
        data.sType = this.sType;
        data.fileName = this.fileName;
        data.size = this.size;
        data.format = this.format;
        data.impWorker = this.impWorker;
        data.impDate = this.impDate;
        data.urlDb = this.urlDb;
        data.urlFile = this.urlFile;
        data.memo = this.memo;
        data.fileContent = this.fileContent;
        data.updateTime = this.updateTime;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.fileId = this.fileId;
        data.productLine = this.productLine;
        data.version = this.version;
        data.projectNm = this.projectNm;
        data.specification = this.specification;
        data.bType = this.bType;
        data.mType = this.mType;
        data.sType = this.sType;
        data.fileName = this.fileName;
        data.size = this.size;
        data.format = this.format;
        data.impWorker = this.impWorker;
        data.impDate = this.impDate;
        data.urlDb = this.urlDb;
        data.urlFile = this.urlFile;
        data.memo = this.memo;
        data.fileContent = this.fileContent;
        data.updateTime = this.updateTime;
        return data;
    }

});

FM.dataApi.scModelMatchG = function (data, options) {
    return new FM.dataApi.ScModelMatchG(data, options);
};
