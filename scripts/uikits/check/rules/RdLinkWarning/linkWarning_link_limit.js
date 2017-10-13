/**
 * Created by 王明东 on 2017/8/23.
 */

fastmap.uikit.check.rule.linkWarning_link_limit = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'linkWarning_link_limit';
        this.description = '9级路辅路、10级路、步行街、人渡不能是警示信息的进入线！';
    },

    check: function (editResult) {
        if (!editResult.link) {
            return [];
        }
        if ((editResult.link.properties.kind == 9 &&
            editResult.link.properties.form.split(';').indexOf('34') > -1) ||
            editResult.link.properties.kind == 10 ||
            editResult.link.properties.kind == 11 ||
            editResult.link.properties.form.split(';').indexOf('20') > -1) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
