/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.rdcross_integrity = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'PERMIT_CHECK_IS_INTEGRITY_RDCROSS';
        this.description = '路口信息不完整，请选择至少一个Node点';
    },

    check: function (editResult) {
        if (editResult.nodes.length > 0) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
