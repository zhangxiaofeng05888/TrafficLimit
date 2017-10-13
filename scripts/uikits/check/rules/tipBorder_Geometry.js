/**
 * Created by linglong on 2017/3/27.
 */

fastmap.uikit.check.tipBorder_Geometry = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'tipBorder_Geometry';
        this.description = '至少绘制一条标识线再进行保存！';
    },

    check: function (editResult) {
        if (editResult.finalGeometry.coordinates.length) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.situation = 'precheck';
        return [result];
    }
});
