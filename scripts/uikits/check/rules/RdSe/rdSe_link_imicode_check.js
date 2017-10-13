/**
 * Created by wuzhen on 2017/8/2.
 */
fastmap.uikit.check.rule.rdSe_link_imicode_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdSe_link_imicode_check';
        this.description = 'link有"II属性"或"M属性"不允许作为退出线';
    },

    check: function (editResult) {
        var result = this.getCheckResult(this.description, editResult.geoLiveType);
        if (!editResult.outLink) {
            return [];
        }
        if (editResult.outLink.properties.imiCode === 1 ||
            editResult.outLink.properties.imiCode === 2) {
            return [result];
        }

        return [];
    }
});
