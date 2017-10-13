/**
 * Created by wuzhen on 2017/3/27.
 */
fastmap.uikit.topoEdit.IxPoiBatchTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 批量平移poi显示坐标工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getTranslateLocationEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchTranslatePoiLocationEditResult();
        editResult.geoLiveType = 'IXPOI';
        return editResult;
    },

    /**
     * 批量重合poi显示坐标工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getConvergeLocationEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchConvergePoiLocationEditResult();
        editResult.geoLiveType = 'IXPOI';
        return editResult;
    },

    /**
     * 根据给定的link自动批量更新poi引导坐标工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getPoiGuideAutoEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchPoiGuideAutoEditResult();
        editResult.geoLiveType = 'IXPOI';
        return editResult;
    },

    /**
     * 批量手动指定poi引导坐标工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getPoiGuideManualEditResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.BatchPoiGuideManualEditResult();
        editResult.geoLiveType = 'IXPOI';
        return editResult;
    },

    /**
     * 处理显示坐标平移
     * @param editResult 编辑结果
     */
    translateLocation: function (editResult) {
        var data = [];
        for (var i = 0; i < editResult.pois.length; ++i) {
            var poi = editResult.pois[i];
            var location = [
                poi.geometry.coordinates[0] + editResult.offsetX,
                poi.geometry.coordinates[1] + editResult.offsetY
            ];
            var guidePoint = [
                poi.properties.guideX,
                poi.properties.guideY
            ];
            data.push({
                pid: poi.properties.id,
                location: location,
                guidePoint: guidePoint,
                guideLink: poi.properties.guideLink
            });
        }
        return this.dataService.batchMovePOI(data);
    },

    /**
     * 处理显示坐标重合
     * @param editResult 编辑结果
     */
    convergeLocation: function (editResult) {
        var data = [];
        for (var i = 0; i < editResult.pois.length; ++i) {
            var poi = editResult.pois[i];
            var location = [
                editResult.point.coordinates[0],
                editResult.point.coordinates[1]
            ];
            var guidePoint = [
                poi.properties.guideX,
                poi.properties.guideY
            ];
            data.push({
                pid: poi.properties.id,
                location: location,
                guidePoint: guidePoint,
                guideLink: poi.properties.guideLink
            });
        }
        return this.dataService.batchMovePOI(data);
    },

    /**
     * 根据给定的link批量更新引导坐标和引导link
     * @param editResult 编辑结果
     */
    updatePoiGuideAuto: function (editResult) {
        var data = [];
        for (var i = 0; i < editResult.pois.length; ++i) {
            var poi = editResult.pois[i];
            var location = [
                poi.geometry.coordinates[0],
                poi.geometry.coordinates[1]
            ];
            var guidePoint = [
                editResult.guidePoints[i].coordinates[0],
                editResult.guidePoints[i].coordinates[1]
            ];
            var isGpsLink = editResult.guideLinks[i].properties.geoLiveType === 'TIPLINKS';
            data.push({
                pid: poi.properties.id,
                location: location,
                guidePoint: guidePoint,
                guideLink: isGpsLink ? 0 : editResult.guideLinks[i].properties.id
            });
        }
        return this.dataService.batchMovePOI(data);
    },

    /**
     * 手动指定位置,批量更新引导坐标和引导link
     * @param editResult 编辑结果
     */
    updatePoiGuideManual: function (editResult) {
        var data = [];
        for (var i = 0; i < editResult.pois.length; ++i) {
            var poi = editResult.pois[i];
            var location = [
                poi.geometry.coordinates[0],
                poi.geometry.coordinates[1]
            ];
            var guidePoint = [
                editResult.guidePoint.coordinates[0],
                editResult.guidePoint.coordinates[1]
            ];
            var isGpsLink = editResult.guideLink.properties.geoLiveType === 'TIPLINKS';
            data.push({
                pid: poi.properties.id,
                location: location,
                guidePoint: guidePoint,
                guideLink: isGpsLink ? 0 : editResult.guideLink.properties.id
            });
        }
        return this.dataService.batchMovePOI(data);
    }
});

