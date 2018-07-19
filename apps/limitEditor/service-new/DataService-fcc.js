/**
 * Created by xujie3949 on 2017/1/6.
 */

fastmap.service.DataServiceFcc = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    copyToLine: function (data) {
        var url = 'limit/run';
        return this.createAjaxPromise('post', url, data);
    },

    trackLine: function (data) {
        var url = 'limit/searchPassLink';
        return this.createAjaxPromise('post', url, data);
    },

    getByPids: function (data) {
        var url = 'limit/getByPids';
        return this.createAjaxPromise('get', url, data);
    },

    deleteLine: function (data) {
        var url = 'limit/run';
        return this.createAjaxPromise('get', url, data);
    },

    createAjaxPromise: function (method, url, parameter) {
        var fullUrl = App.Util.getInfoUrl(url);

        var promise = new Promise(function (resolve, reject) {
            var options = {
                url: fullUrl,
                requestParameter: parameter,
                timeout: 10000,
                responseType: 'json',
                onSuccess: function (json) {
                    if (json.errcode == 0) { // 操作成功
                        resolve(json.data);
                    } else {
                        reject(json.errmsg);
                    }
                },
                onFail: function (errmsg) {
                    reject(errmsg);
                },
                onError: function (errmsg) {
                    reject(errmsg);
                },
                onTimeout: function (errmsg) {
                    reject(errmsg);
                }
            };
            fastmap.mapApi.ajax[method](options);
        });

        return promise;
    },

    destroy: function () {
        fastmap.service.DataServiceFcc.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.service.DataServiceFcc.instance) {
                fastmap.service.DataServiceFcc.instance =
                    new fastmap.service.DataServiceFcc();
            }
            return fastmap.service.DataServiceFcc.instance;
        }
    },

    getMetaDataByCondition: function (params) {
        var url = 'limit/getMetaDataByCondition';
        return this.createAjaxPromise('get', url, params);
    },

    getLimitDataByCondition: function (params) {
        var url = 'limit/getLimitDataByCondition';
        return this.createAjaxPromise('get', url, params);
    }
});
