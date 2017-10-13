/**
 * Created by zhaohang on 2017/3/23.
 */
fastmap.uikit.check.rule.rdTollGate_node_hookLink_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'GLM13034';
        this.description = '关系型收费站主点的挂接link数必须是2';
    },

    check: function (editResult) {
        if (!editResult.node) {
            return [];
        }
        if (editResult.node.properties.links.length !== 2) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'runtime';
            return [result];
        }
        return [];
    }
});
