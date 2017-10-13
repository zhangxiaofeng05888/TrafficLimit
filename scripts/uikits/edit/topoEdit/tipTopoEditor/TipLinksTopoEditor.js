/**
 * Created by zhaohang on 2017/3/31.
 */

fastmap.uikit.topoEdit.TipLinksTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        editResult.geoLiveType = 'TIPLINKS';
        editResult.snapActors = [{
            geoLiveType: 'RDNODE',
            priority: 2,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'TIPLINKS',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'RDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
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
        editResult.geoLiveType = 'TIPLINKS';
        editResult.snapActors = [];
        editResult.finalGeometry = FM.Util.clone(options.originObject.geometry.g_location);
        editResult.snapActors = [{
            geoLiveType: 'RDNODE',
            priority: 2,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'TIPLINKS',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'RDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
        return editResult;
    },

    /**
     * 打断测线需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getBreakEditResult: function (options) {
        var editResult = new fastmap.uikit.shapeEdit.BreakTipLinksResult();
        editResult.originObject = options.originObject;
        editResult.geoLiveType = 'TIPLINKS';
        editResult.snapActors = [
            {
                id: options.originObject.pid,
                geoLiveType: 'TIPLINKS'
            }
        ];
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var linksData = fastmap.dataApi.tipLinks({});
        var finalGeometry = editResult.finalGeometry;
        linksData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(finalGeometry, 5);
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
        linksData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        linksData.deep.geo = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        linksData.deep.len = this.geometryAlgorithm.getLength(finalGeometry);
        return this.dataServiceTips.saveTips(linksData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var linksData = editResult.originObject;
        var finalGeometry = editResult.finalGeometry;
        linksData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(finalGeometry, 5);
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
        linksData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        linksData.deep.geo = this.geometryAlgorithm.precisionGeometry(pointGeometry, 5);
        linksData.deep.len = this.geometryAlgorithm.getLength(finalGeometry);
        return this.dataServiceTips.saveTips(linksData, 1);
    },

    /**
     * 测线打断接口
     */
    break: function (editResult) {
        var linksData = editResult.originObject;
        return this.dataServiceTips.breakTips(linksData.rowkey, editResult.breakPoint);
    }
});

