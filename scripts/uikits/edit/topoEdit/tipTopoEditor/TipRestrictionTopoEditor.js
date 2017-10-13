/**
 * Created by zhaohang on 2017/5/17.
 */

fastmap.uikit.topoEdit.TipRestrictionTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        editResult.geoLiveType = 'TIPRESTRICTION';
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
                id: obj.deep.f.id
            },
            type: obj.deep.f.type === 2 ? 'tips' : ''
        };
        editResult.guideLink.geometry = this.featureSelector.selectByFeatureId(obj.deep.f.id, obj.deep.f.type === 1 ? 'RDLINK' : 'TIPLINKS').geometry;
        editResult.geoLiveType = 'TIPRESTRICTION';
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
        var restrictionData = fastmap.dataApi.tipRestriction({});
        restrictionData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        restrictionData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        restrictionData.deep.f.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            restrictionData.deep.f.type = 2;
        } else {
            restrictionData.deep.f.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        restrictionData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        return this.dataServiceTips.saveTips(restrictionData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var restrictionData = editResult.originObject;
        restrictionData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        restrictionData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        restrictionData.deep.f.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            restrictionData.deep.f.type = 2;
        } else {
            restrictionData.deep.f.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        restrictionData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        return this.dataServiceTips.saveTips(restrictionData, 1);
    }
});

