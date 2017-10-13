/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.PanTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PanTool';
    },

    onActive: function (map, onFinish, options) {
        if (!fastmap.uikit.MapTool.prototype.onActive.apply(this, arguments)) {
            return false;
        }

        this.map.getContainer().style.cursor = 'pointer';
        this.map.dragging.enable();
        this.map.touchZoom.enable();
        this.map.boxZoom.enable();
        this.map.keyboard.enable();

        return true;
    },

    onDeactive: function () {
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        return fastmap.uikit.MapTool.prototype.onDeactive.apply(this, arguments);
    }
});
