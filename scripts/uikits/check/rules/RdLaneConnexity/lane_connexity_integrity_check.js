/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.lane_connexity_integrity_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'PERMIT_CHECK_IS_INTEGRITY_RDLANE';
        this.description = '车信信息不完整，车信信息应该是完整的线点线关系,以及车道方向信息';
    },

    check: function (editResult) {
        if (editResult.inLink && editResult.inNode && editResult.lanes.length > 0 && editResult.topos.length > 0) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
