/**
 * Created by zhaohang on 2017/3/22.
 */
fastmap.uikit.check.rule.rdWarningInfo_link_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM01028_5';
        this.description = '9级路辅路、10级路、步行街、人渡不能是警示信息的进入线';
    },

    check: function (editResult) {
        if (!editResult.inLink) {
            return [];
        }
        if ((editResult.inLink.properties.kind == 9 &&
            editResult.inLink.properties.form.split(';').indexOf('34') > -1) ||
            editResult.inLink.properties.kind == 10 ||
            editResult.inLink.properties.kind == 11 ||
            editResult.inLink.properties.form.split(';').indexOf('20') > -1) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
