/**
 * Created by zhaohang on 2017/3/29.
 */
fastmap.uikit.topoEdit.TipTollGateTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.shapeEdit.PointGuideLinkResult();
        editResult.geoLiveType = 'TIPTOLLGATE';
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
        var editResult = new fastmap.uikit.shapeEdit.PointGuideLinkResult();
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
        editResult.geoLiveType = 'TIPTOLLGATE';
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
        var tollgateData = fastmap.dataApi.tipTollGate({});
        tollgateData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        tollgateData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        tollgateData.deep.in.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            tollgateData.deep.in.type = 2;
        } else {
            tollgateData.deep.in.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        tollgateData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        return this.dataServiceTips.saveTips(tollgateData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var tollgateData = editResult.originObject;
        tollgateData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        tollgateData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        tollgateData.deep.in.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            tollgateData.deep.in.type = 2;
        } else {
            tollgateData.deep.in.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        tollgateData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        return this.dataServiceTips.saveTips(tollgateData, 1);
    }
});

