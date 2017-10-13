/**
 * Created by zhaohang on 2017/4/19.
 */

fastmap.uikit.topoEdit.TipRoundAboutTopoEditor = fastmap.uikit.topoEdit.TipTopoEditor.extend({
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
        editResult.geoLiveType = 'TIPROUNDABOUT';
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
        editResult.geoLiveType = 'TIPROUNDABOUT';
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
        var roundAboutData = fastmap.dataApi.tipRoundabout({});
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
        roundAboutData.deep.f_array = linkData;
        roundAboutData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(polygonData, 5);
        roundAboutData.deep.geo = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        roundAboutData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        return this.dataServiceTips.saveTips(roundAboutData, 0);
    },

    /**
     * 更新接口
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var roundAboutData = editResult.originObject;
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
        roundAboutData.deep.f_array = linkData;
        roundAboutData.geometry.g_location = this.geometryAlgorithm.precisionGeometry(polygonData, 5);
        roundAboutData.deep.geo = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        roundAboutData.geometry.g_guide = this.geometryAlgorithm.precisionGeometry(locationPoint, 5);
        return this.dataServiceTips.saveTips(roundAboutData, 1);
    }
});

