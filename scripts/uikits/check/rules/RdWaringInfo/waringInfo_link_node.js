/**
 * Created by wangmingdong on 2017/7/20.
 */
fastmap.uikit.check.rule.rdWarningInfo_link_node = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'warning_link_node';
        this.description = '警示信息关系要完整，警示信息必须是完整的线点关系';
    },

    check: function (editResult) {
        if (editResult.inNode && editResult.inLink) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
