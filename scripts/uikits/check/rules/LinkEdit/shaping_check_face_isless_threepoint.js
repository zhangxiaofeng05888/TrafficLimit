/**
 * Created by linglong on 2017/5/8.
 */
fastmap.uikit.check.rule.shaping_check_face_isless_threepoint = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'shaping_check_face_isless_threepoint';
        this.description = 'Face的形状点不能少于3个!';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        var linkGeo = editResult.finalGeometry.coordinates;
        
        if (linkGeo.length < 2) {
            return [];
        }
        var isFaceLink = this.uikitUtil.isFaceLink(linkGeo);
        if (linkGeo.length <= 3 && isFaceLink) {
            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
        }
        return [];
    }
});
