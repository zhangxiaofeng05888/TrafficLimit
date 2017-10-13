/**
 * Created by wuzhen on 2017/3/30.
 */
fastmap.uikit.topoEdit.AdAdminTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.shapeEdit.PointLocationResult();
        editResult.geoLiveType = 'ADADMIN';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.PointLocationResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'ADADMIN';
        editResult.coordinate = obj.geometry;
        editResult.guide = obj.guidePoint;
        editResult.guideLink = obj.guideLink;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var param = {
            longitude: editResult.coordinate.coordinates[0],
            latitude: editResult.coordinate.coordinates[1],
            linkPid: editResult.guideLink.properties.id
        };
        return this.dataService.create('ADADMIN', param);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var param = {
            objId: editResult.originObject.pid,
            data: {
                longitude: editResult.coordinate.coordinates[0],
                latitude: editResult.coordinate.coordinates[1],
                // x_guide: editResult.guide.coordinates[0],
                // y_guide: editResult.guide.coordinates[1],
                linkPid: editResult.guideLink.properties.id
            }
        };
        return this.dataService.moveObj('ADADMIN', param);
    }
});

