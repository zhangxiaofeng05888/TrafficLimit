/**
 * Created by zhaohang on 2017/6/7.
 */

fastmap.uikit.topoEdit.TipNomalRestrictionTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.shapeEdit.TipNomalRestrictionResult();
        editResult.geoLiveType = 'TIPNOMALRESTRICTION';
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
        var editResult = new fastmap.uikit.shapeEdit.TipNomalRestrictionResult();
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
        editResult.geoLiveType = 'TIPNOMALRESTRICTION';
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
        var normalRestrictionData = fastmap.dataApi.tipNomalRestriction({});
        normalRestrictionData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        normalRestrictionData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        normalRestrictionData.deep.in.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            normalRestrictionData.deep.in.type = 2;
        } else {
            normalRestrictionData.deep.in.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        normalRestrictionData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        var directData = [];
        var outArray = [];
        for (var i = 0; i < editResult.directData.length; i++) {
            directData.push({
                sq: i + 1,
                flag: editResult.directData[i].type,
                info: editResult.directData[i].direct
            });
            outArray.push({
                sq: i + 1,
                oInfo: editResult.directData[i].direct,
                out: [],
                flag: editResult.directData[i].type,
                time: ''
            });
        }
        normalRestrictionData.deep.info = directData;
        normalRestrictionData.deep.o_array = outArray;
        return this.dataServiceTips.saveTips(normalRestrictionData, 0);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var normalRestrictionData = editResult.originObject;
        normalRestrictionData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(editResult.coordinate, 5);
        normalRestrictionData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(editResult.guide, 5);
        normalRestrictionData.deep.in.id = editResult.guideLink.properties.id.toString();
        var linkGeometry = {
            type: 'LineString',
            coordinates: []
        };
        if (editResult.guideLink.type === 'tips') {
            linkGeometry.coordinates = editResult.guideLink.geometry.geometries[1].coordinates;
            normalRestrictionData.deep.in.type = 2;
        } else {
            normalRestrictionData.deep.in.type = 1;
            linkGeometry.coordinates = editResult.guideLink.geometry.coordinates;
        }
        normalRestrictionData.deep.agl = this.uikitUtil.getNorthAngle(editResult.coordinate, editResult.guide, linkGeometry);
        return this.dataServiceTips.saveTips(normalRestrictionData, 1);
    }
});

