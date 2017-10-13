/**
 * Created by zhaohang on 2017/5/3.
 */

fastmap.uikit.topoEdit.SelectTipsAndPOITopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.PolygonResult();
        editResult.geoLiveType = 'REGIONSELECT';
        editResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var params = {};
        var tips = [];
        var pois = [];
        editResult.tipsArray.forEach(function (item) {
            if (item.properties.geoLiveType === 'IXPOI') {
                pois.push(item.properties.id);
            } else {
                tips.push(item.properties.id);
            }
        });
        params.tips = tips;
        params.pois = pois;
        params.taskId = editResult.idObj.taskId;
        params.subtaskId = editResult.idObj.subtaskId;
        this.eventController.fire(L.Mixin.EventTypes.STARTRELOADINBG);
        return this.dataServiceTips.changeTipsAndPOIState(params);
    }
});

