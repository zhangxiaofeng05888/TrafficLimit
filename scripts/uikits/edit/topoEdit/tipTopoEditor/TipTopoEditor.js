/**
 * Created by zhaohang on 2017/6/12.
 */

fastmap.uikit.topoEdit.TipTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        this.geometryTransform = fastmap.mapApi.GeometryTransform.getInstance();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.proj4Transform = fastmap.mapApi.Proj4Transform.getInstance();
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
        var rowkey = options.pid;
        return this.dataServiceTips.getTipsResult(rowkey);
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
    save: function (geoLiveObject) {
        var objectEditCtrl = geoLiveObject;
        var contentFlag = false;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month.toString();
        } else {
            month = month.toString();
        }
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var seconds = date.getSeconds();
        var time = year.toString() + month + day.toString() + hour.toString() + minute.toString() + seconds.toString();
        if (!objectEditCtrl.content || objectEditCtrl.content === '') {
            objectEditCtrl.feedback.f_array = objectEditCtrl.feedback.f_array.filter(
                function (item) {
                    return item.type !== 3;
                }
            );
        }
        if (objectEditCtrl.feedback.f_array.length > 0) {
            for (var i = 0; i < objectEditCtrl.feedback.f_array.length; i++) {
                if (objectEditCtrl.feedback.f_array[i].type === 3 && objectEditCtrl.content !== '') {
                    objectEditCtrl.feedback.f_array[i].user = App.Temp.userId;
                    objectEditCtrl.feedback.f_array[i].content = objectEditCtrl.content;
                    objectEditCtrl.feedback.f_array[i].date = time;
                    contentFlag = true;
                }
            }
        }
        if (objectEditCtrl.content && (!contentFlag || objectEditCtrl.feedback.f_array.length === 0) && objectEditCtrl.content !== '') {
            objectEditCtrl.feedback.f_array.push(
                {
                    user: App.Temp.userId,
                    userRole: '',
                    type: 3,
                    content: objectEditCtrl.content,
                    auditRemark: '',
                    date: time
                }
            );
        }
        return this.dataServiceTips.saveTips(objectEditCtrl, 1);
    },

    /**
     * 查询删除操作确认信息接口
     * 子类可以重写此方法
     * @param geoLiveObject 需要删除的对象
     */
    queryDeleteConfirmInfo: function (geoLiveObject) {

    },

    /**
     * 删除接口
     * 子类可以重写此方法
     * @param geoLiveObject 需要删除的对象
     */
    delete: function (geoLiveObject) {
        var rowkey = geoLiveObject.pid;
        return this.dataServiceTips.deleteTips(rowkey);
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
    }
});

