/**
 * Created by wuzhen on 2017/3/28.
 */

fastmap.uikit.check.rule.ixPoi_batch_translate_location_integrity_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'ixPoi_batch_translate_location_integrity_check';
        this.description = '';
    },

    check: function (editResult) {
        if (editResult.type !== 'BatchTranslatePoiLoactionEditResult') {
            return [];
        }

        if (!editResult.pois || editResult.pois.length === 0) {
            return [this.getCheckResult('请先框选poi', editResult.geoLiveType, 'precheck')];
        }

        if (editResult.offsetX === 0 && editResult.offsetY === 0) {
            return [this.getCheckResult('请先平移poi显示坐标', editResult.geoLiveType, 'precheck')];
        }
        return [];
    }
});
