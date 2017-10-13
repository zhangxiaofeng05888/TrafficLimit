/**
 * Created by wuzhen on 2017/3/28.
 */

fastmap.uikit.check.rule.ixPoi_batch_guide_auto_integrity_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'ixPoi_batch_guide_auto_integrity_check';
        this.description = '';
    },

    check: function (editResult) {
        if (editResult.type !== 'BatchPoiGuideAutoEditResult') {
            return [];
        }

        if (!editResult.pois || editResult.pois.length === 0) {
            return [this.getCheckResult('请先框选poi', editResult.geoLiveType, 'precheck')];
        }

        if (!editResult.links || editResult.links.length === 0) {
            return [this.getCheckResult('请先框选link', editResult.geoLiveType, 'precheck')];
        }
        return [];
    }
});
