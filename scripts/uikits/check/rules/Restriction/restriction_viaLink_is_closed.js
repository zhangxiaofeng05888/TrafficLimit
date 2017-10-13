/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.restriction_viaLink_is_closed = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.apply(this, arguments);

        this.id = 'RDLANE004';
        this.description = '经过线没有闭合，请完成经过线设置';
    },

    check: function (editResult) {
        var isPassed = true;

        if (editResult.parts.length !== 0) {
            for (var i = 0; i < editResult.parts.length; ++i) {
                var part = editResult.parts[i];
                if (!this.checkPart(part)) {
                    isPassed = false;
                    break;
                }
            }
        }

        if (!isPassed) {
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'precheck';
            return [result];
        }

        return [];
    },

    checkPart: function (part) {
        if (!part.outLink) {
            return true;
        }

        if (!part.relationshipType || part.relationshipType === 1) {
            return true;
        }

        if (part.viaLinks.length === 0) {
            return true;
        }

        var viaLink = part.viaLinks[part.viaLinks.length - 1];
        return this.uikitUtil.canPass(viaLink, part.outLink);
    }
});
