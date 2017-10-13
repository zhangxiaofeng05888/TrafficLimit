/**
 * Created by wuzhen on 2017/3/31.
 * 用于线的自动打断
 */
fastmap.uikit.editControl.BreakLinksControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        this.base = fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = new fastmap.uikit.topoEdit.LinksAutoBreakTopoEditor(this.map, geoLiveType);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getCreateEditResult();
        this.complexEditor.start(editResult, this.onToolFinish);

        return true;
    },

    onToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        this.toolController.pause();

        this.topoEditor
            .break(editResult)
            .then(this.onCreateSuccess)
            .catch(this.onCreateFail);
    },

    onCreateSuccess: function (res) {
        this.toolController.continue();
        if (res !== '属性值未发生变化') {
            // 根据服务log获取发生变更的要素类型列表
            var geoLiveTypes = this.getChangedGeoLiveTypes(this.geoLiveType, res.log);

            // 刷新对应图层
            this.sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);
        }
        // 重新执行流程方便连续创建
        this.run();
    },

    onCreateFail: function (err) {
        this.toolController.continue();
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
