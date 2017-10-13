/**
 * Created by mali on 2017/5/9.
 */
fastmap.uikit.topoEdit.CmgBuildingTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.CmgBuildingResult();
        editResult.geoLiveType = 'CMGBUILDING';
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var faces = editResult.faces;
        var facePids = [];
        for (var i = 0; i < faces.length; i++) {
            facePids.push(faces[i].properties.id);
        }
        var data = {
            facePids: facePids
        };
        return this.dataService.create('CMGBUILDING', data);
    }
});

