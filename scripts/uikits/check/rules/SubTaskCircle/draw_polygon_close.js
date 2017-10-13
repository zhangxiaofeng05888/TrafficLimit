/**
 * Created by zhaohang on 2017/7/13.
 */
fastmap.uikit.check.rule.draw_polygon_close = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'draw_polygon_close';
        this.description = '必须绘制闭合的面几何！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';

        if (!editResult.isClosed) {
            return [result];
        }
        return [];
    }
});
