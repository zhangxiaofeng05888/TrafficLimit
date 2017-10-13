/**
 * Created by wuzhen on 2017/3/28.
 */

fastmap.uikit.check.rule.ixPoi_name_kindCode_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'ixPoi_name_kindCode_check';
        this.description = '名称和分类为必填项';
    },

    check: function (editResult) {
        if (editResult.type !== 'IxPoiResult') {
            return [];
        }

        if (editResult.name && editResult.kindCode && editResult.kindCode != '0') {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'precheck')];
    }
});
