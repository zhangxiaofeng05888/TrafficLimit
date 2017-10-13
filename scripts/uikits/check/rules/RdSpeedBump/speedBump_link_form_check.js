/**
 * Created by zhaohang on 2017/3/22.
 */
fastmap.uikit.check.rule.rdSpeedBump_link_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM34005';
        this.description = '制作了减速带的LINK，不能含有以下道路形态：区域内道路、提左、提右、交叉口内道路、环岛、调头口、主辅路出入口、步行街';
    },

    check: function (editResult) {
        if (!editResult.inLink) {
            return [];
        }
        if (editResult.inLink.properties.form.indexOf('52') > -1 ||
            editResult.inLink.properties.form.indexOf('37') > -1 ||
            editResult.inLink.properties.form.indexOf('38') > -1 ||
            editResult.inLink.properties.form.indexOf('50') > -1 ||
            editResult.inLink.properties.form.indexOf('33') > -1 ||
            editResult.inLink.properties.form.indexOf('35') > -1 ||
            editResult.inLink.properties.form.indexOf('10') > -1 ||
            editResult.inLink.properties.form.indexOf('39') > -1) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
