/**
 * Created by zhaohang on 2017/5/3.
 */

fastmap.uikit.topoEdit.TipRegionRoadTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.ScopeLineResult();
        editResult.geoLiveType = 'TIPREGIONROAD';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.ScopeLineResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'TIPREGIONROAD';
        editResult.polygon = obj.geometry.g_location;
        for (var i = 0; i < obj.deep.f_array.length; i++) {
            editResult.links.push(this.featureSelector.selectByFeatureId(obj.deep.f_array[i].id, obj.deep.f_array[i].type === 1 ? 'RDLINK' : 'TIPLINKS'));
        }
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var regionRoadData = fastmap.dataApi.tipRegionRoad({});
        var links = editResult.links;
        var polygonData = editResult.polygon;
        var linkData = [];
        var locationPoint = this.geometryAlgorithm.centroid(polygonData);
        for (var i = 0; i < links.length; i++) {
            linkData.push(
                {
                    id: links[i].properties.id.toString(),
                    type: links[i].type === 'tips' ? 2 : 1,
                    geoF: links[i].type === 'tips' ? this.geometryAlgorithm.precisionGeometry(links[i].geometry.geometries[1], 5) : this.geometryAlgorithm.precisionGeometry(links[i].geometry, 5)
                }
            );
        }
        regionRoadData.deep.f_array = linkData;
        regionRoadData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(polygonData, 5);
        regionRoadData.deep.geo = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        regionRoadData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        return this.dataServiceTips.saveTips(regionRoadData, 0);
    },

    /**
     * 更新接口
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var regionRoadData = editResult.originObject;
        var links = editResult.links;
        var polygonData = editResult.polygon;
        var linkData = [];
        var locationPoint = this.geometryAlgorithm.centroid(polygonData);
        for (var i = 0; i < links.length; i++) {
            linkData.push(
                {
                    id: links[i].properties.id.toString(),
                    type: links[i].type === 'tips' ? 2 : 1,
                    geoF: links[i].type === 'tips' ? this.geometryAlgorithm.precisionGeometry(links[i].geometry.geometries[1], 5) : this.geometryAlgorithm.precisionGeometry(links[i].geometry, 5)
                }
            );
        }
        regionRoadData.deep.f_array = linkData;
        regionRoadData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(polygonData, 5);
        regionRoadData.deep.geo = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        regionRoadData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        return this.dataServiceTips.saveTips(regionRoadData, 1);
    }
});

