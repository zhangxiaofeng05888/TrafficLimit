/**
 * Created by xujie3949 on 2016/12/28.
 * 要素编辑基类
 */

fastmap.uikit.topoEdit.TopoEditor = L.Class.extend({
    initialize: function (map) {
        // 绑定函数作用域
        FM.Util.bind(this);
        this.map = map;
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.dataServiceFcc = fastmap.service.DataServiceFcc.getInstance();
        this.dataServiceTips = fastmap.service.DataServiceTips.getInstance();
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    },

    /**
     * 创建工具需要使用的EditResult
     * 子类需要重写此方法
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        throw new Error('函数未实现');
    },

    /**
     * 修改工具需要使用的EditResult
     * 子类需要重写此方法
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        throw new Error('函数未实现');
    },

    /**
     * 转化geoLiveType变为主表名，如：分歧10种类型
     * 子类需要重写此方法
     * @param geoLiveType
     * @returns {null}
     */
    getServerFeatureType: function (geoLiveType) {
        return geoLiveType;
    },

    /**
     * 根据服务器返回的log提取pid
     * 返回pid
     * @param options
     */
    getPidFromLog: function (log) {
        return log.pid;
    },

    //  分歧类要素获取pid时用
    getDetailPidFromResponse: function (resp) {
        var log = resp.log[0];
        if (log.childPid) {
            return log.childPid;
        }

        if (log.rowId) {
            return log.rowId;
        }

        return resp.pid;
    },

    /**
     * 获取对象的标识
     * @param geoLiveObject
     */
    getId: function (geoLiveObject) {
        return geoLiveObject.pid;
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param options
     */
    query: function (options) {
        var pid = options.pid;
        var geoLiveType = options.geoLiveType;
        var dbId = options.dbId; // add by chenx on 2017-8-1
        return this.dataService.getByPid(pid, geoLiveType, dbId);
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        throw new Error('函数未实现');
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        throw new Error('函数未实现');
    },

    /**
     * 更新变化属性接口
     * 子类可以重写此方法
     * @param geoLiveObject 修改后的对象
     */
    updateChanges: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        var changes = geoLiveObject.getChanges();
        if (!changes) {
            return Promise.resolve('属性无变化');
        }
        return this.dataService.updateChanges(pid, geoLiveType, changes);
    },

    /**
     * 查询删除操作确认信息接口
     * 子类可以重写此方法
     * @param geoLiveObject 需要删除的对象
     */
    queryDeleteConfirmInfo: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        return this.dataService.getDeleteConfirmInfo(pid, geoLiveType);
    },

    /**
     * 删除接口
     * 子类可以重写此方法
     * @param geoLiveObject 需要删除的对象
     */
    delete: function (geoLiveObject) {
        var pid = geoLiveObject.pid;
        var geoLiveType = geoLiveObject.geoLiveType;
        return this.dataService.delete(pid, geoLiveType);
    },

    /**
     * 要素是否可以查询
     * 子类可以重写
     * @param geoLiveObject
     * @returns {boolean}
     */
    canQuery: function (geoLiveObject) {
        return true;
    },

    /**
     * 要素是否可以删除
     * 子类可以重写
     * @param geoLiveObject
     * @returns {boolean}
     */
    canDelete: function (geoLiveObject) {
        return true;
    },

    /**
     * 要素是否可以编辑
     * 子类可以重写
     * @param geoLiveObject
     * @returns {boolean}
     */
    canEdit: function (geoLiveObject) {
        return true;
    },

    /**
     * 获取数组中非空的数据
     * @param arr
     * @returns {Array}
     */
    getRealData: function (arr) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i];
            if (temp) {
                list.push(temp);
            }
        }
        return list;
    }
});

