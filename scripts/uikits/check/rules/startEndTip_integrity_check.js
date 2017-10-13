/**
 * Created by zhaohang on 2017/8/1.
 */
fastmap.uikit.check.rule.startEndTip_integrity_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'startEndTip_integrity_check';
        this.description = '起终点信息不完整，无法创建！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';

        if (editResult.geoLiveType === 'TIPMULTIDIGITIZED') {
            if (!editResult.startPointData || !editResult.finishPointData) {
                return [result];
            }
            return [];
        }

        if (!editResult.startData || !editResult.endData) {
            return [result];
        }
        return [];
    }
});
