/**
 * Created by 79358 on 2017/5/23.
 */
fastmap.uikit.check.rule.check_adlink_face_must_composed_by_closedlink = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'check_adlink_face_must_composed_by_closedlink';
        this.description = '行政区划Face必须要有2根及以上组成link!';
    },

    check: function (editResult) {
        if (editResult.firstNodePid) {
            if (editResult.links.length >= 2) {
                return [];
            }
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'precheck';
            return [result];
        }
        return [];
    }
});
