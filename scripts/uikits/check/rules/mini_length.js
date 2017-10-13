/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.mini_length = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = '1';
        this.description = 'Link的长度必须大于2米';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        return [result];
    }
});
