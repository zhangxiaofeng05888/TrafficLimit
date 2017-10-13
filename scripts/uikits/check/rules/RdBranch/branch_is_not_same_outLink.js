/**
 * Created by 王明东 on 2017/4/25.
 */

fastmap.uikit.check.rule.branch_is_not_same_outLink = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_is_not_same_outLink';
        this.description = '不能选择原退出线或经过线，请重新选择';
    },

    check: function (editResult) {
        var notSameVia = false;
        if (!editResult.originObject) {
            return [];
        }
        if (!editResult.outLink) {
            return [];
        }
        if (editResult.originObject.outLinkPid != editResult.outLink.properties.id) {
            return [];
        }
        if (editResult.vias.length) {
            if (editResult.vias.length == editResult.originObject.vias.length) {
                for (var i = 0; i < editResult.vias.length; i++) {
                    if (editResult.vias[i].properties.id != editResult.originObject.vias[i].linkPid) {
                        notSameVia = true;
                    }
                }
            } else {
                notSameVia = true;
            }
            if (notSameVia) {
                return [];
            }
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
