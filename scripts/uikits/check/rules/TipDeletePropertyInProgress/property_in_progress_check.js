/**
 * Created by zhaohang on 2017/7/4.
 */
fastmap.uikit.check.rule.property_in_progress_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'property_in_progress_check';
        this.description = '所选择的link或测线没有"在建"属性！';
    },

    check: function (editResult) {
        if (editResult.guideLink) {
            if (editResult.guideLink.properties.cons === 1 || (editResult.guideLink.properties.limit && editResult.guideLink.properties.limit.indexOf('10') != -1)) {
                return [];
            }
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
