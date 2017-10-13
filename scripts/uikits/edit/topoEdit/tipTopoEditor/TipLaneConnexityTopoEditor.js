/**
 * Created by zhaohang on 2017/4/25.
 */

fastmap.uikit.topoEdit.TipLaneConnexityTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.shapeEdit.TipLaneConnexityResult();
        editResult.geoLiveType = 'TIPLANECONNEXITY';
        editResult.snapActors = [{
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
        var obj = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.TipLaneConnexityResult();
        editResult.coordinate = obj.geometry.g_location;
        editResult.guide = obj.geometry.g_guide;
        editResult.guideLink = {
            geometry: {},
            properties: {
                id: obj.deep.in.id
            },
            type: obj.deep.in.type === 2 ? 'tips' : ''
        };
        editResult.guideLink.geometry = this.featureSelector.selectByFeatureId(obj.deep.in.id, obj.deep.in.type === 1 ? 'RDLINK' : 'TIPLINKS').geometry;
        editResult.geoLiveType = 'TIPLANECONNEXITY';
        editResult.snapActors = [{
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
        editResult.originObject = obj;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var laneData = fastmap.dataApi.tipLaneConnexity({});
        laneData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        laneData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        laneData.deep.in.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            laneData.deep.in.type = 2;
        } else {
            laneData.deep.in.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        laneData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        var directData = [];
        var outArray = [];
        for (var i = 0; i < editResult.directData.length; i++) {
            directData.push({
                sq: i + 1,
                ext: editResult.directData[i].extend ? 1 : 0,
                arwG: editResult.directData[i].direct,
                arwB: editResult.directData[i].busDirect
            });
            outArray.push({
                sq: i + 1,
                ext: editResult.directData[i].extend ? 1 : 0,
                d_array: []
            });
        }
        laneData.deep.info = directData;
        laneData.deep.o_array = outArray;
        return this.dataServiceTips.saveTips(laneData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var laneData = editResult.originObject;
        laneData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        laneData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        laneData.deep.in.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            laneData.deep.in.type = 2;
        } else {
            laneData.deep.in.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        laneData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        return this.dataServiceTips.saveTips(laneData, 1);
    }
});

