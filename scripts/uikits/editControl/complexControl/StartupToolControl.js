/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.StartupToolControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, toolName, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.toolName = toolName;
        this.options = options;
    },

    run: function () {
        // 注意:地图漫游流程不需要切换场景
        this.setCurrentControl(this);

        var success = this.toolController.resetCurrentTool(this.toolName, null, null);
        if (!success) {
            swal('提示', '未能激活工具:' + this.toolName, 'info');
            return false;
        }

        return true;
    }
});
