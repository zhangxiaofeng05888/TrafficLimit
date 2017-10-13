/**
 * Created by zhaohang on 2017/3/28.
 */
fastmap.uikit.check.rule.rdDirectRoute_link_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM01028_6';
        this.description = '10级路/步行街/人渡不能是顺行的进入线，退出线，经过线。';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        if (!editResult.inLink) {
            return [];
        }
        if (editResult.inLink.properties.kind == 10 || editResult.inLink.properties.kind == 11 || editResult.inLink.properties.form.indexOf('20') > -1) {
            return [result];
        }
        if (!editResult.outLink) {
            return [];
        }
        if (editResult.outLink.properties.kind == 10 || editResult.outLink.properties.kind == 11 || editResult.outLink.properties.form.indexOf('20') > -1) {
            return [result];
        }
        if (editResult.vias.length === 0) {
            return [];
        }
        if (editResult.vias[editResult.vias.length - 1].properties.kind == 10 ||
            editResult.vias[editResult.vias.length - 1].properties.kind == 11 ||
            editResult.vias[editResult.vias.length - 1].properties.form.indexOf('20') > -1) {
            return [result];
        }

        return [];
    }
});
