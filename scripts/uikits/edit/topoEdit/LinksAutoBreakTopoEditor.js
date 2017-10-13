/**
 * Created by wuzhen on 2017/7/3.
 */

fastmap.uikit.topoEdit.LinksAutoBreakTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map, selectType) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.selectTypes = [selectType];
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.complexEdit.LinksAutoBreakResult();
        editResult.selectTypes = this.selectTypes;
        editResult.geoLiveType = 'LINKBREAK'; // 不是要素，但是保存前也需要进行检查
        return editResult;
    },

    /**
     * 打断接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    break: function (editResult) {
        var links = [];
        for (var i = 0; i < editResult.parts.length; i++) {
            var temp = editResult.parts[i];
            links.push(temp.feature.properties.id);
        }
        var data = {
            longitude: editResult.point.coordinates[0],
            latitude: editResult.point.coordinates[1],
            nodePid: editResult.nodePid
        };
        return this.dataService.breakLinks('RDLINK', links, data);
    }
});

