/**
 * Created by wuzhen on 2017/4/17.
 */
fastmap.uikit.check.rule.rdSlope_links_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdSlope_links_check';
        this.description = '坡度记录主点的挂接link不能小于3条';
    },

    check: function (editResult) {
        if (!editResult.inNode || (editResult.inNode && editResult.inNode.properties.links.length >= 3)) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
    }
});
