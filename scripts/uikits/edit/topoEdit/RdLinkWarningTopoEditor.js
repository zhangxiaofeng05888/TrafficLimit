/**
 * Created by wangmingdong on 2017/8/22.
 */
fastmap.uikit.topoEdit.RDLinkWarningTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        editResult.geoLiveType = 'RDLINKWARNING';
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
        editResult.geoLiveType = 'RDLINKWARNING';
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
        return this.dataService.create('RDLINKWARNING', data);
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
        return this.dataService.update('RDLINKWARNING', data);
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param options
     */
    query: function (options) {
        var pid = options.pid;
        var geoLiveType = 'RDLINKWARNING';
        return this.dataService.getByPid(pid, geoLiveType, options.dbId);
    }
});

