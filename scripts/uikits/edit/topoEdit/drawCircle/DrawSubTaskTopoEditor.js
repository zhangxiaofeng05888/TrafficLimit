/**
 * Created by zhaohang on 2017/7/10.
 */

fastmap.uikit.topoEdit.DrawSubTaskTopoEditor = L.Class.extend({
    initialize: function (map) {
        // 绑定函数作用域
        FM.Util.bind(this);
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        editResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        editResult.geoLiveType = 'DRAWSUBTASK';
        editResult.changeDirection = false;
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult, id) {
        var params = {
            taskId: App.Temp.taskId,
            condition: {
                lineWkt: this.geometryAlgorithm.geoJsonToWkt(editResult.finalGeometry)
            }
        };
        if (id > 0) {
            params.condition.id1 = id;
        }

        return this.dataService.planSubTask(params);
    }
});
