/**
 * Created by zhaohang on 2017/4/24.
 */

fastmap.uikit.topoEdit.TipConnectTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TipTopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.shapeEdit.PointResult();
        editResult.geoLiveType = 'TIPCONNECT';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.PointResult();
        editResult.coordinate = obj.geometry.g_location;
        editResult.geoLiveType = 'TIPCONNECT';
        editResult.originObject = obj;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var connectData = fastmap.dataApi.tipConnect({});
        connectData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        connectData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        connectData.deep.agl = parseFloat(connectData.deep.agl);
        return this.dataServiceTips.saveTips(connectData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var connectData = editResult.originObject;
        connectData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        connectData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        return this.dataServiceTips.saveTips(connectData, 1);
    }
});

