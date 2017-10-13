/**
 * Created by zhaohang on 2017/6/6.
 */

fastmap.uikit.topoEdit.TipHighWayConnectTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        editResult.geoLiveType = 'TIPHIGHWAYCONNECT';
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
        editResult.geoLiveType = 'TIPHIGHWAYCONNECT';
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
        var roadSAData = fastmap.dataApi.tipHighWayConnect({});
        roadSAData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        roadSAData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        roadSAData.deep.f.id = editResult.guideLink.properties.id.toString();
        if (editResult.guideLink.type === 'tips') {
            roadSAData.deep.f.type = 2;
        } else {
            roadSAData.deep.f.type = 1;
        }
        return this.dataServiceTips.saveTips(roadSAData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var roadSAData = editResult.originObject;
        roadSAData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        roadSAData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        roadSAData.deep.f.id = editResult.guideLink.properties.id.toString();
        if (editResult.guideLink.type === 'tips') {
            roadSAData.deep.f.type = 2;
        } else {
            roadSAData.deep.f.type = 1;
        }
        return this.dataServiceTips.saveTips(roadSAData, 1);
    }
});

