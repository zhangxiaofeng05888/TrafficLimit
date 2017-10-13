/**
 * Created by zhaohang on 2017/3/24.
 */
fastmap.uikit.check.rule.rdTollGate_inLink_outLink_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM01028_1';
        this.description = '10级路/步行街/人渡不能是关系型收费站的进入、退出线。';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        if (!editResult.inLink) {
            return [];
        }
        if (editResult.inLink.properties.kind == 10 ||
            editResult.inLink.properties.kind == 11 ||
            editResult.inLink.properties.form.indexOf('20') > -1) {
            return [result];
        }
        if (!editResult.outLink) {
            return [];
        }
        if (editResult.outLink.properties.kind == 10 ||
            editResult.outLink.properties.kind == 11 ||
            editResult.outLink.properties.form.indexOf('20') > -1) {
            return [result];
        }
        return [];
    }
});
