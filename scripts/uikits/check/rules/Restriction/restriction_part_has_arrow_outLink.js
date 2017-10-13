/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.restriction_part_has_arrow_outLink = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);

        this.id = 'restriction_part_has_arrow_outLink';
        this.description = '方向箭头没有对应的退出线';
    },

    check: function (editResult) {
        var isPassed = true;

        var errors = [];
        if (editResult.parts.length !== 0) {
            for (var i = 0; i < editResult.parts.length; ++i) {
                var part = editResult.parts[i];
                this.checkPart(i + 1, part, errors);
            }
        }

        return errors;
    },

    checkPart: function (index, part, errors) {
        if (part.outLink) {
            return;
        }

        var err = this.getCheckResult('第' + index + '个方向箭头没有对应的退出线', 'RESTRICTION', 'precheck');
        errors.push(err);
    }
});
