/**
 * Created by wangmingdong on 2017/3/17.
 */
fastmap.uikit.topoEdit.RDSpeedLimitTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.LinkPointDirectResult();
        editResult.geoLiveType = 'RDSPEEDLIMIT';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.LinkPointDirectResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDSPEEDLIMIT';
        editResult.link = this.featureSelector.selectByFeatureId(obj.linkPid, 'RDLINK');
        editResult.originLink = this.featureSelector.selectByFeatureId(obj.linkPid, 'RDLINK');
        editResult.direct = obj.direct;
        editResult.moveDistance = 50;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            direct: parseInt(editResult.direct, 10),
            linkPid: editResult.link.properties.id,
            longitude: editResult.point.coordinates[0],
            latitude: editResult.point.coordinates[1]
        };
        return this.dataService.create('RDSPEEDLIMIT', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var data = {
            pid: editResult.originObject.pid,
            direct: parseInt(editResult.direct, 10),
            linkPid: editResult.link.properties.id,
            longitude: editResult.point.coordinates[0],
            latitude: editResult.point.coordinates[1],
            objStatus: 'UPDATE'
        };
        return this.dataService.update('RDSPEEDLIMIT', data);
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param options
     */
    query: function (options) {
        var pid = options.pid;
        var geoLiveType = 'RDSPEEDLIMIT';
        var promise = null;

        if (options.state === 2) {   //  如果点限速是删除状态
            promise = this.dataService.getDelByPid(pid, geoLiveType, options.dbId).then(function (data) {
                data.state = options.state;
                return data;
            });
        } else {
            promise = this.dataService.getByPid(pid, geoLiveType, options.dbId);
        }
        return promise;
    },

    /**
     * 要素是否可以编辑
     * @param geoLiveObject
     * @returns {boolean}
     */
    canEdit: function (geoLiveObject) {
        var f = true;

        if (geoLiveObject.state && geoLiveObject.state === 2) {
            f = false;
        }
        return f;
    },

    /**
     * 要素是否可以删除
     * @param geoLiveObject
     * @returns {boolean}
     */
    canDelete: function (geoLiveObject) {
        var f = true;

        if (geoLiveObject.state && geoLiveObject.state === 2) { //  如果已经是删除状态，不可以重复删除
            f = false;
        }
        return f;
    }
});

