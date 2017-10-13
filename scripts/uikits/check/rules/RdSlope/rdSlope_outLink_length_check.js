/**
 * Created by wuzhen on 2017/8/7.
 * 如果没有接续线的时候，退出线可以大于150米，如果有接续线则退出线和接续线的总和不能大于150米
 */
fastmap.uikit.check.rule.rdSlope_outLink_length_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'rdSlope_outLink_length_check';
        this.description = '坡度的长度不能大于150米!';
    },

    check: function (editResult) {
        var linkLength = this._getJoinLinksLength(editResult.outLink, editResult.joinLinks);
        if (linkLength <= 150) {
            return [];
        }
        return [this.getCheckResult(this.description, editResult.geoLiveType)];
    },

    _getJoinLinksLength: function (outLink, joinLinks) {
        var length = 0;
        if (!(joinLinks && joinLinks.length > 0)) {
            return length;
        }

        length = outLink.properties.length;
        for (var i = 0; i < joinLinks.length; i++) {
            length += joinLinks[i].properties.length;
        }
        return length;
    }
});
