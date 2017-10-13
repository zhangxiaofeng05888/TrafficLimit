/**
 * Created by 79358 on 2017/5/4.
 */
fastmap.uikit.check.rule.check_face_must_composed_by_closedlink = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'check_face_must_composed_by_closedlink';
        this.description = '闭合的线才能生成面!';
    },

    check: function (editResult) {
        if (editResult.firstNodePid) {
            if (editResult.firstNodePid === editResult.lastNodePid) {
                return [];
            }
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'precheck';
            return [result];
        } else if (!editResult.firstNodePid && !editResult.finalGeometry) {
            var rst = new fastmap.uikit.check.CheckResult();
            rst.message = this.description;
            rst.geoLiveType = editResult.geoLiveType;
            rst.situation = 'precheck';
            return [rst];
        }
        return [];
    }
});
