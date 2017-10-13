/**
 * Created by linglong on 2017/3/27.
 */

fastmap.uikit.check.rule.buffer_width = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'buffer_width';
        this.description = '请按C键设置距离后再进行保存！';
    },

    check: function (editResult) {
        if (editResult.distance) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.situation = 'precheck';
        return [result];
    }
});
