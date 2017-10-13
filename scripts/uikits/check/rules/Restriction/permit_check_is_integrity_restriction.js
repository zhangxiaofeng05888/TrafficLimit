/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.permit_check_is_integrity_restriction = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);

        this.id = 'PERMIT_CHECK_IS_INTEGRITY_RDRESTRICTION';
        this.description = '交限信息不完整，交限信息应该是完整的线点多线关系';
    },

    check: function (editResult) {
        var isPassed = this.checkEditResult(editResult);

        if (!isPassed) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'precheck';
            return [result];
        }

        return [];
    },

    checkEditResult: function (editResult) {
        if (!editResult.inLink) {
            return false;
        }

        if (!editResult.node) {
            return false;
        }

        if (editResult.parts.length === 0) {
            return false;
        }

        return true;
    }
});
