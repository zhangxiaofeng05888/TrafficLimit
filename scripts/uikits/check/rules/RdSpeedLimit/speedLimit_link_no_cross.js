/**
 * Created by 王明东 on 2017/3/21.
 */

fastmap.uikit.check.rule.speedLimit_link_no_cross = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'speedLimit_link_no_cross';
        this.description = '交叉点内道路属性link上不能制作点限速';
    },

    check: function (editResult) {
        if (!editResult.link) {
            return [];
        }
        if (editResult.link && editResult.link.properties.form.split(';').indexOf('50') == -1) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
