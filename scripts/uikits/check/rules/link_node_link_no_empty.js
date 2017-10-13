/**
 * Created by zhaohang on 2017/3/23.
 */

fastmap.uikit.check.rule.link_node_link_no_empty = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'link_node_link_no_empty';
        this.description = '创建要素所需条件不全，无法创建';
    },

    check: function (editResult) {
        if (editResult.inLink && editResult.node && editResult.outLink) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
