/**
 * Created by 王明东 on 2017/3/27.
 */

fastmap.uikit.check.rule.branch_link_node_link_no_empty = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'branch_link_node_link_no_empty';
        this.description = '分歧信息关系要完整，分歧信息应该是完整的线点线关系';
    },

    check: function (editResult) {
        if (editResult.relationshipType == 1 && editResult.inLink && editResult.inNode && editResult.outLink) {
            return [];
        }
        if (editResult.relationshipType == 2 && editResult.inLink && editResult.inNode && editResult.outLink && editResult.isClose) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
