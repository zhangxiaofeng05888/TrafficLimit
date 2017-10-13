/**
 * Created by wuzhen on 2017/3/28.
 */

fastmap.uikit.check.rule.ixPoi_link_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'ixPoi_link_form_check';
        this.description = 'form为空或者包含50的道路不能作为引导link';
    },

    check: function (editResult) {
        if (editResult.type !== 'IxPoiResult') {
            return [];
        }
        if (editResult.tipOrLinkFlag === 2) { // 测线
            return [];
        }
        if (!editResult.guideLink || (editResult.guideLink.properties.form && editResult.guideLink.properties.form.indexOf(
                '50') === -1)) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
    }
});
