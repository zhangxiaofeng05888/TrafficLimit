/**
 * Created by zhaohang on 2017/6/15.
 */

fastmap.uikit.check.rule.tipSketch_save_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'tipSketch_save_check';
        this.description = '草图几何不完整，无法创建';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        if (!editResult.startNode) {
            return [result];
        }
        return [];
    }
});
