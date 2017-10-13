/**
 * Created by zhaohang on 2017/6/8.
 */

fastmap.uikit.check.rule.tipRoadSA_data_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'tipRoadSA_data_check';
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
        result.situation = 'precheck';
        return [result];
    }
});
