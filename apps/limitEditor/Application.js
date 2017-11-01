/**
 * 定义web app全局命名空间，并在此空间下定义属性和函数，以便全局使用
 * @file       Application.js
 * @author     ChenXiao
 * @date       2017-08-03 11:57:21
 *
 * @copyright: @Navinfo, all rights reserved.
 */

/**
 * App全局命名空间
 * @type {Object}
 */
var App = {};

/**
 * 全局配置信息
 * @type {Object}
 */
App.Config = {
    appName: 'FM-WebEditor',
    /* 生产服务 */
    // serviceUrl: 'http://fastmap.navinfo.com/service',
    // subdomainsServiceUrl: 'http://{s}.navinfo.com/service',

    /* 旧版服务 */
    // serviceUrl: 'http://fs-road.navinfo.com/dev/fm315/service',
    // subdomainsServiceUrl: 'http://fs-road.navinfo.com/dev/fm315/service',

    /* trunk服务 */
    serviceUrl: 'http://fs-road.navinfo.com/dev/trunk/service',
    /* 情报部门更新情报库的地址 */
    infoDepartmentsUrl: 'http://192.168.15.77:8090/iqu/data',
    /* trunk地图服务 */
    subdomainsServiceUrl: 'http://fs-road.navinfo.com/dev/trunk/service',
    /* 用于特殊Url的处理，目前未用到 */
    specialUrl: 'http://apis.map.qq.com/ws/streetview/v1',
    /**
     * 地图图层相关的配置
     * @type {Object}
     */
    map: {
        layerZoom: {
            minZoom: 10,
            maxZoom: 21,
            minEditZoom: 15
        },
        tipEditZoom: 17
    }
};

/**
 * 临时全局变量，在程序中初始化
 * @type {Object}
 */
App.Temp = {
    /*
    * 记录从情报列表点击到作业组列表时需要的信息
    * */
    infoToGroupData: null,
    accessToken: null,
    userId: 0,
    userName: '',
    dbId: 0,
    groupId: 0,
    cityGeometry: null,
    subTaskId: 0,
    subTaskName: '',
    mdFlag: 'd',
    gridList: [],
    taskType: null,
    monthTaskType: null,
    qcTaskFlag: false,
    User: null,
    SubTask: null,
    Settings: {},
    programType: 0 // 任务类型标识，快线4，中线1
};

/**
 * 公用函数命名空间
 * @type {Object}
 */
App.Util = {
    /**
     * 获取webapp的根目录
     * @method  getAppPath
     * @author  ChenXiao
     * @date    2017-09-13
     * @return  {String} app根目录
     */
    getAppPath: function () {
        return location.pathname.substr(0, location.pathname.indexOf('/apps'));
    },
    /**
     * 生成限行限号url地址
     * @method  getFullUrl
     * @author  ChenXiao
     * @date    2017-09-13
     * @param   {String}   url 接口api相对路径
     * @return  {String}   url地址
     */
    getInfoUrl: function (url) {
        return App.Config.serviceUrl + '/' + url + '?access_token=' + (App.Temp.accessToken || '');
    },
    /**
     * 生成限行限号url地址
     * @method  getFullUrl
     * @author  ChenXiao
     * @date    2017-09-13
     * @param   {String}   url 接口api相对路径
     * @return  {String}   url地址
     */
    getInfoDepartmentsUrl: function (url) {
        return App.Config.infoDepartmentsUrl + '/' + url;
    },
    /**
     * 生成url地址
     * @method  getFullUrl
     * @author  ChenXiao
     * @date    2017-09-13
     * @param   {String}   url 接口api相对路径
     * @return  {String}   url地址
     */
    getFullUrl: function (url) {
        return App.Config.serviceUrl + '/' + url + '?access_token=' + (App.Temp.accessToken || '');
    },
    /**
     * 生成特殊的url地址[建议不要使用]
     * @method  getSpecUrl
     * @author  ChenXiao
     * @date    2017-09-13
     * @param   {String}   url 接口api相对路径
     * @return  {String}   url地址
     */
    getSpecUrl: function (url) {
        return App.Config.specialUrl + '/' + url + '?access_token=' + (App.Temp.accessToken || '');
    },
    /**
     * 生成地图渲染需要的多域名url地址
     * @method  getSubdomainsUrl
     * @author  ChenXiao
     * @date    2017-09-13
     * @param   {String}   url 接口api相对路径
     * @return  {String}   url地址
     */
    getSubdomainsUrl: function (url) {
        return App.Config.subdomainsServiceUrl + '/' + url + '?access_token=' + (App.Temp.accessToken || '');
    },
    /**
     * 从url地址中获取拼接的参数值
     * @method  getUrlParam
     * @author  ChenXiao
     * @date    2017-09-13
     * @param   {String}    paramName 参数名称
     * @return  {String}    参数值
     */
    getUrlParam: function (paramName) {
        var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)');
        var str = window.location.search;
        var ret;
        if (!str) {
            str = window.location.hash;
        }
        if (str) {
            ret = str.substr(str.indexOf('?') + 1).match(reg);
        }
        if (ret) {
            return unescape(ret[2]);
        }
        return null;
    },
    /**
     * 退出系统
     * @method logout
     * @author ChenXiao
     * @date   2017-9-13
     * @return {Undefined} 无返回值
     */
    logout: function () {
        window.location.href = '#/login';
    },
    /**
     * 清理全局临时变量
     * @method clearAppTemp
     * @author ChenXiao
     * @date   2017-9-13
     * @return {Undefined} 无返回值
     */
    clearAppTemp: function () {
        App.Temp.accessToken = null;
        App.Temp.userId = 0;
        App.Temp.dbId = 0;
        App.Temp.subTaskId = 0;
    },
    /**
     * 获取session storage的键值
     * @method getSessionStorageKey
     * @author ChenXiao
     * @date   2017-9-13
     * @return {String} appName-token
     */
    getSessionStorageKey: function () {
        return App.Config.appName + '-' + (App.Temp.accessToken || 'XXX');
    },
    /**
     * 获取存储在session storage中的对象
     * @method getSessionStorageObject
     * @author ChenXiao
     * @date   2017-9-13
     * @return {Object} 存储在session storage中的对象
     */
    getSessionStorageObject: function () {
        var skey = App.Util.getSessionStorageKey();

        return JSON.parse(sessionStorage.getItem(skey));
    },
    /**
     * 删除存储在session storage中的对象
     * @method removeSessionStorageObject
     * @author ChenXiao
     * @date   2017-9-13
     * @return {Undefined} 无返回值
     */
    removeSessionStorageObject: function () {
        var skey = App.Util.getSessionStorageKey();
        sessionStorage.removeItem(skey);
    },
    /**
     * 设置存储在session storage中的对象的键值对
     * @method setSessionStorage
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {String} key   键
     * @param  {Any}    value 值
     * @return {Undefined} 无返回值
     */
    setSessionStorage: function (key, value) {
        var skey = App.Util.getSessionStorageKey();
        var obj = JSON.parse(sessionStorage.getItem(skey)) || {};
        obj[key] = value;
        sessionStorage.setItem(skey, JSON.stringify(obj));
    },
    /**
     * 获取存储在session storage中的对象的键值
     * @method getSessionStorage
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {String} key 键
     * @return {Any}        值
     */
    getSessionStorage: function (key) {
        var obj = App.Util.getSessionStorageObject();

        if (obj) {
            return obj[key];
        }
        return null;
    },
    /**
     * 从存储在session storage中的对象中删除一个键值对
     * @method removeSessionStorage
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {String} key 键
     * @return {Undefined}  无返回值
     */
    removeSessionStorage: function (key) {
        var skey = App.Util.getSessionStorageKey();
        var obj = JSON.parse(sessionStorage.getItem(skey));
        if (obj) {
            delete obj[key];
            sessionStorage.setItem(skey, JSON.stringify(obj));
        }
    },
    /**
     * 获取local storage的键值
     * @method getLocalStorageKey
     * @author ChenXiao
     * @date   2017-9-13
     * @return {String}  appName-userId
     */
    getLocalStorageKey: function () {
        return App.Config.appName + '-' + App.Temp.userId;
    },
    /**
     * 获取存储在local storage中的对象
     * @method getLocalStorageObject
     * @author ChenXiao
     * @date   2017-9-13
     * @return {Object}  存储对象
     */
    getLocalStorageObject: function () {
        var lkey = App.Util.getLocalStorageKey();
        return JSON.parse(localStorage.getItem(lkey));
    },
    /**
     * 删除存储在local storage中的对象
     * @method removeLocalStorageObject
     * @author ChenXiao
     * @date   2017-9-13
     * @return {Undefined} 无返回值
     */
    removeLocalStorageObject: function () {
        var lkey = App.Util.getSessionStorageKey();
        localStorage.removeItem(lkey);
    },
    /**
     * 设置存储在local storage中的对象的键值
     * @method setLocalStorage
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {String} key   键
     * @param  {Any}    value 值
     * @return {Undefined} 无返回值
     */
    setLocalStorage: function (key, value) {
        var lkey = App.Util.getLocalStorageKey();
        var obj = JSON.parse(localStorage.getItem(lkey)) || {};
        obj[key] = value;
        localStorage.setItem(lkey, JSON.stringify(obj));
    },
    /**
     * 从存储在local storage中的对象中获取一个键对应的值
     * @method getLocalStorage
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {String} key 键
     * @return {Any}        值
     */
    getLocalStorage: function (key) {
        var obj = App.Util.getLocalStorageObject();

        if (obj) {
            return obj[key];
        }
        return null;
    },
    /**
     * 从存储在local storage中的对象中删除一个键值对
     * @method removeLocalStorage
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {String} key 键
     * @return {Undefined} 无返回值
     */
    removeLocalStorage: function (key) {
        var lkey = App.Util.getLocalStorageKey();
        var obj = JSON.parse(localStorage.getItem(lkey));
        if (obj) {
            delete obj[key];
            localStorage.setItem(lkey, JSON.stringify(obj));
        }
    },
    /**
     * 检测用户使用的浏览器客户端是否在指定的浏览器列表中
     * @method testBrowser
     * @author ChenXiao
     * @date   2017-9-13
     * @param  {Array} browserList 浏览器列表（name/大版本）
     * @return {Boolean} 是否在指定的浏览器列表中
     */
    testBrowser: function (browserList) {
        var f = false;
        /**
         * 获取用户的浏览器信息
         * @method myBrowser
         * @author ChenXiao
         * @date   2017-9-13
         * @return {String} 浏览器名称/大版本号
         */
        var myBrowser = function () {
            var userAgent = navigator.userAgent;
            var isOpera = userAgent.indexOf('Opera') >= 0;
            if (isOpera) {
                return userAgent.match(/Opera\/\d+/)[0];
            }
            if (userAgent.indexOf('Firefox') >= 0) {
                return userAgent.match(/Firefox\/\d+/)[0];
            }
            if (userAgent.indexOf('Chrome') >= 0) {
                return userAgent.match(/Chrome\/\d+/)[0];
            }
            if (userAgent.indexOf('Safari') >= 0) {
                return userAgent.match(/Safari\/\d+/)[0];
            }
            if (userAgent.indexOf('compatible') >= 0 && userAgent.indexOf('MSIE') >= 0 && !isOpera) {
                return userAgent.match(/MSIE\/\d+/)[0];
            }
            return 'Unknown';
        };

        var ub = myBrowser().split('/');

        var cb;
        for (var i = 0; i < browserList.length; i++) {
            cb = browserList[i].split('/');
            if (cb[0] === ub[0]) {
                if (cb.length > 1) {
                    if (parseInt(ub[1], 10) >= parseInt(cb[1], 10)) {
                        f = true;
                    }
                } else {
                    f = true;
                }
                break;
            }
        }

        return f;
    }
};

// 从url请求中获取token
// commented by chenx on 2017-5-3, 单页面程序只加载一次，不需此操作
// App.Temp.accessToken = App.Util.getUrlParam('access_token');
