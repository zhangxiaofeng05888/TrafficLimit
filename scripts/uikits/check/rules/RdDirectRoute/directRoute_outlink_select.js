/**
 * Created by wangmingdong on 2017/4/27.
 */

fastmap.uikit.check.rule.directRoute_outlink_select = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'directRoute_outlink_select';
        this.description = '只能选择路口关系退出线!';
    },

    check: function (editResult) {
        if (!editResult.inLink) {
            return [];
        }
        if (!editResult.inNode) {
            return [];
        }
        if (!editResult.outLink) {
            return [];
        }

        if (editResult.inLink && editResult.inNode && editResult.outLink) {
            if (editResult.outLink.properties.enode == editResult.inNode.properties.id || editResult.outLink.properties.snode == editResult.inNode.properties.id) {
                return [];
            }
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
