/**
 * Created by zhaohang on 2017/3/23.
 */

fastmap.uikit.check.rule.permit_node_finalGeometry_no_empty = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'permit_node_finalGeometry_no_empty';
        this.description = '未选择位置, 不能完成操作';
    },

    check: function (editResult) {
        if (editResult.finalGeometry) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
