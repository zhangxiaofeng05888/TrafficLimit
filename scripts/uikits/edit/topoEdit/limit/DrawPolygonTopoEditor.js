/**
 * Created by zhaohang on 2017/10/17.
 */

fastmap.uikit.topoEdit.DrawPolygonTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
    getCopyResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.DrawPolygonResult();
        editResult.geoLiveType = 'DRAWPOLYGON';
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    copy: function (editResult) {
        var links = [];
        for (var i = 0; i < editResult.links.length; i++) {
            links.push(editResult.links[i].properties.id);
        }
        var params = {
            type: 'SCPLATERESFACE',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId,
                geometryIds: links
            }
        };
        return this.dataServiceFcc.copyToLine(params);
    }
});
