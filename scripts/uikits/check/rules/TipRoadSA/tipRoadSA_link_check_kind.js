/**
 * Created by zhaohang on 2017/5/27.
 */

fastmap.uikit.check.rule.tipRoadSA_link_check_kind = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'tipRoadSA_link_check_kind';
        this.description = '只能在高速道路、城市高速制作此tips';
    },

    check: function (editResult) {
        if (editResult.guideLink) {
            if (editResult.guideLink.properties.kind === 1 || editResult.guideLink.properties.kind === 2) {
                return [];
            }
        } else {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
