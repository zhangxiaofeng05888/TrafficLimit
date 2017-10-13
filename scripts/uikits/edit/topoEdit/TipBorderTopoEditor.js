/**
 * Created by linglong on 2017/3/28.
 */

fastmap.uikit.topoEdit.TipBorderTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.shapeEdit.TipBorderResult();
        editResult.geoLiveType = 'TIPBORDER';
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var content = [];
        for (var i = 0; i < editResult.finalGeometry.coordinates.length; i++) {
            var tempLine = { type: 'LineString', coordinates: editResult.finalGeometry.coordinates[i] };
            content.push({ geo: tempLine, style: '105000000' });
        }
        var data = {
            g_location: editResult.startNode,
            content: content,
            memo: ''
        };
        return this.dataServiceFcc.addJoinBorder(data);
    }
});

