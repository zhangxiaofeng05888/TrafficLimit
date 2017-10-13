/**
 * Created by wuzhen on 2017/3/23.
 */
fastmap.uikit.check.rule.rdSlope_outLink_kind_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdSlope_outLink_kind_check';
        this.description = '坡度的退出线不能时9级以上道路';
    },

    check: function (editResult) {
        if (!editResult.outLink) {
            return [];
        }
        if (parseInt(editResult.outLink.properties.kind, 10) > 9) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
