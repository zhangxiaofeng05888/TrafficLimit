/**
 * Created by zhaohang on 2017/3/24.
 */
fastmap.uikit.topoEdit.RdHgWgLimitTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        editResult.geoLiveType = 'RDHGWGLIMIT';
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
        editResult.geoLiveType = 'RDHGWGLIMIT';
        editResult.link = this.featureSelector.selectByFeatureId(obj.linkPid, 'RDLINK');
        editResult.point = obj.geometry;
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
        return this.dataService.create('RDHGWGLIMIT', data);
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
            latitude: editResult.point.coordinates[1]
        };
        return this.dataService.move('RDHGWGLIMIT', data);
    }
});

