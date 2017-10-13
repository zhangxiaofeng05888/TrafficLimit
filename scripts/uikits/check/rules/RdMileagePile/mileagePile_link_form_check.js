/**
 * Created by zhaohang on 2017/3/21.
 */
fastmap.uikit.check.rule.mileagePile_link_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'mileagePile_link_form_check';
        this.description = '道路形态为交叉点内道路、调头口、主辅路出入口、提左、提右时不能创建里程桩！';
    },

    check: function (editResult) {
        if (!editResult.link) {
            return [];
        }
        if (editResult.link.properties.form.indexOf('50') > -1 ||
            editResult.link.properties.form.indexOf('35') > -1 ||
            editResult.link.properties.form.indexOf('39') > -1 ||
            editResult.link.properties.form.indexOf('37') > -1 ||
            editResult.link.properties.form.indexOf('38') > -1) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
