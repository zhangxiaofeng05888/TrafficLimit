/**
 * Created by wangtun on 2017/4/26.
 */
fastmap.uikit.check.rule.rdSe_link_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM01028_2';
        this.description = '10级路/步行街/人渡不能是SE的进入、退出线。';
    },

    check: function (editResult) {
        var _self = this;
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        if (!editResult.inLink) {
            return [];
        }
        if (editResult.inLink.properties.kind == 10 ||
            editResult.inLink.properties.kind == 11 ||
            editResult.inLink.properties.form.split(';').indexOf('20') > -1) {
            return [result];
        }

        if (!editResult.outLink) {
            return [];
        }
        if (editResult.outLink.properties.kind == 10 ||
            editResult.outLink.properties.kind == 11 ||
            editResult.outLink.properties.form.split(';').indexOf('20') > -1) {
            return [result];
        }

        return [];
    }
});
