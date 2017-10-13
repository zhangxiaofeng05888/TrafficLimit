/**
 * Created by zhaohang on 2017/6/15.
 */

fastmap.uikit.check.rule.tipLaneConnexity_extend_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'tipLaneConnexity_extend_check';
        this.description = '附加车道不连续,无法创建';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        if (editResult.directData.length > 0) {
            var numArray = [];
            for (var i = 0; i < editResult.directData.length; i++) {
                if (numArray.length === 0) {
                    numArray.push(editResult.directData[i].extend);
                }
                if (editResult.directData[i].extend !== numArray[numArray.length - 1]) {
                    numArray.push(editResult.directData[i].extend);
                }
            }
            if (numArray.length > 3 || (!numArray[0] && !numArray[numArray.length - 1] && numArray.length !== 1)) {
                return [result];
            }
        }
        return [];
    }
});
