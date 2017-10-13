/**
 * Created by zhongxiaoming on 2017/2/6.
 */
fastmap.uikit.editControl.BatchModifyTipsControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);
        // 绑定函数作用域
        FM.Util.bind(this);
        this.options = options;
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.apply(this, arguments)) {
            return false;
        }

        var toolName = 'RectSelectTool';
        var success = this.toolController.resetCurrentTool(toolName, this.onSelectFinish);
        if (!success) {
            swal('提示', '未能激活选择工具:' + toolName, 'info');
            return false;
        }

        return true;
    },

    onSelectFinish: function (features) {
        var items = [];
        for (var i = 0; i < features.length; ++i) {
            var feature = features[i];
            if (FM.uikit.Config.isTip(feature.properties.geoLiveType)) {
                items.push(feature);
            }
        }
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: items });
        this.toolController.resetCurrentTool('PanTool', null);
    }

});
