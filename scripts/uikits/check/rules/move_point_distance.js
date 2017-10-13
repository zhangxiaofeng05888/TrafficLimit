/**
 * Created by 王明东 on 2017/3/22.
 * 移动点位距离控制
 */

fastmap.uikit.check.rule.move_point_distance = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'move_point_distance';
        this.description = '校验移动距离';
    },

    check: function (editResult) {
        var uikitUtil = fastmap.uikit.Util.getInstance();
        if (!editResult.originObject || !editResult.point) {
            return [];
        }
        if (!uikitUtil.canPass(editResult.link, editResult.originLink)) {
            return [];
        }
        if (editResult.originObject && editResult.point) {
            var originData = editResult.originObject.geometry.coordinates;
            var originPoint = L.latLng(originData[1], originData[0]);
            var newPoint = L.latLng(editResult.point.coordinates[1], editResult.point.coordinates[0]);
            if (originPoint.distanceTo(newPoint) < editResult.moveDistance) {
                return [];
            }
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = '移动点位距离不超过' + editResult.moveDistance + 'm';
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
