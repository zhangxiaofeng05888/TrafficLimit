/**
 * Created by 79358 on 2017/5/4.
 */
fastmap.uikit.check.rule.lcLink_with_single_line_river_not_composed_to_face = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'lcLink_with_single_line_river_not_composed_to_face';
        this.description = '创建土地覆盖面的link种别是单线河时，不允许构成面!';
    },

    check: function (editResult) {
        if (!editResult.links) {
            return [];
        }

        var flag = false;

        var lastLink = editResult.links[editResult.links.length - 1];
        if (lastLink && lastLink.properties.geoLiveType != 'RDLINK') {
            lastLink.properties.kind.toString().split(',').forEach(function (item) {
                if (item === '7') {
                    flag = true;
                }
            });
        }

        if (flag) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }

        return [];
    }
});
