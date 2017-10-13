/**
 * Created by zhaohang on 2017/4/18.
 */

fastmap.uikit.topoEdit.TipRoadNameTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        editResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        editResult.geoLiveType = 'TIPROADNAME';
        editResult.snapActors = [];
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        editResult.originObject = options.originObject;
        editResult.geoLiveType = 'TIPROADNAME';
        editResult.snapActors = [];
        editResult.finalGeometry = options.originObject.geometry.g_location;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var roadNameData = fastmap.dataApi.tipRoadName({});
        var finalGeometry = editResult.finalGeometry;
        roadNameData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(finalGeometry, 5);
        var pointGeometry = {
            type: 'Point',
            coordinates: []
        };
        if (finalGeometry.coordinates.length === 2) {
            var locationX = (finalGeometry.coordinates[0][0] + finalGeometry.coordinates[1][0]) / 2;
            var locationY = (finalGeometry.coordinates[0][1] + finalGeometry.coordinates[1][1]) / 2;
            pointGeometry.coordinates.push(locationX);
            pointGeometry.coordinates.push(locationY);
        } else {
            pointGeometry.coordinates = finalGeometry.coordinates[1];
        }
        roadNameData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        roadNameData.deep.geo = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        return this.dataServiceTips.saveTips(roadNameData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var roadNameData = editResult.originObject;
        var finalGeometry = editResult.finalGeometry;
        roadNameData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(finalGeometry, 5);
        var pointGeometry = {
            type: 'Point',
            coordinates: []
        };
        if (finalGeometry.coordinates.length === 2) {
            var locationX = (finalGeometry.coordinates[0][0] + finalGeometry.coordinates[1][0]) / 2;
            var locationY = (finalGeometry.coordinates[0][1] + finalGeometry.coordinates[1][1]) / 2;
            pointGeometry.coordinates.push(locationX);
            pointGeometry.coordinates.push(locationY);
        } else {
            pointGeometry.coordinates = finalGeometry.coordinates[1];
        }
        roadNameData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        roadNameData.deep.geo = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        return this.dataServiceTips.saveTips(roadNameData, 1);
    }
});

