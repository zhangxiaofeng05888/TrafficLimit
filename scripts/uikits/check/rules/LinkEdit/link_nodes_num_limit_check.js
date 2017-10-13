/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.link_nodes_num_limit_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'link_nodes_num_limit_check';
        this.description = '形状点不能大于490个';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        if (editResult.finalGeometry.coordinates.length > 490) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
