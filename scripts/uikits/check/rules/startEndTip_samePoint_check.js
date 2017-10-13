/**
 * Created by zhaohang on 2017/7/4.
 */
fastmap.uikit.check.rule.startEndTip_samePoint_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'startEndTip_samePoint_check';
        this.description = '起终点位置相同,无法创建Tips';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';

        if (editResult.startData && editResult.endData) {
            if ((editResult.startData.pointData.coordinates[0] === editResult.endData.pointData.coordinates[0]) &&
                editResult.startData.pointData.coordinates[1] === editResult.endData.pointData.coordinates[1]) {
                return [result];
            }
        }
        return [];
    }
});
