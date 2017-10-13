/**
 * Created by zhaohang on 2017/7/10.
 */

fastmap.uikit.editControl.DataPlanControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
    },

    run: function () {
        this.setCurrentControl(this);

        var success = this.toolController.resetCurrentTool('PolygonSelectTool', this.onSelectFinish, ['RDLINK', 'IXPOI']);
        if (!success) {
            swal('提示', '未能激活选择工具: PolygonSelectTool', 'info');
            return false;
        }

        return true;
    },

    onSelectFinish: function (features, event) {
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: features, event: event });

        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'dataPlanPanel', data: features });
        // 支持连续选择
        this.run();
    }
});
