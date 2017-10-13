/**
 * Created by wuzhen on 2017/3/28.
 */

fastmap.uikit.check.rule.ixPoi_batch_converge_location_integrity_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'ixPoi_batch_converge_location_integrity_check';
        this.description = '';
    },

    check: function (editResult) {
        if (editResult.type !== 'BatchConvergePoiLoactionEditResult') {
            return [];
        }

        if (!editResult.pois || editResult.pois.length === 0) {
            return [this.getCheckResult('请先框选poi', editResult.geoLiveType, 'precheck')];
        }

        if (!editResult.point) {
            return [this.getCheckResult('请先指定poi显示坐标重合位置', editResult.geoLiveType, 'precheck')];
        }
        return [];
    }
});
