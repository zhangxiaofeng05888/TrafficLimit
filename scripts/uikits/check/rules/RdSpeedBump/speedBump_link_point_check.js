/**
 * Created by 王明东 on 2017/8/4.
 */

fastmap.uikit.check.rule.speedBump_link_point_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'speedBump_link_point_check';
        this.description = '减速带不完整，减速带应该是完整的线点关系';
    },

    check: function (editResult) {
        if (editResult.inLink && editResult.inNode) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
