/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permit_check_is_integrity_rdlink = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'permit_check_is_integrity_rdlink';
        this.description = '创建link至少包含两个点';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        if (editResult.finalGeometry.coordinates.length < 2) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
        }
        return [];
    }
});
