/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.shaping_check_link_ringnobreak_2_link = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'shaping_check_link_ringnobreak_2_link';
        this.description = '起终点过近（2M），并且起终点不重合!';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        
        var linkGeo = this.geometryAlgorithm.precisionGeometry(editResult.finalGeometry, 5).coordinates;

        if (this.uikitUtil.isFaceLink(linkGeo)) {
            return [];
        }
        if (linkGeo.length < 2) {
            return [];
        }

        var firstNode = this.uikitUtil.createPoint([linkGeo[0][0], linkGeo[0][1]]);
        var lastNode = this.uikitUtil.createPoint([linkGeo[linkGeo.length - 1][0], linkGeo[linkGeo.length - 1][1]]);
        var dis = this.geometryAlgorithm.sphericalDistance(firstNode, lastNode);
        if (dis < 2) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
