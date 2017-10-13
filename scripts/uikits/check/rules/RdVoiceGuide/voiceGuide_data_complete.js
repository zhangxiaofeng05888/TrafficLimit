/**
 * Created by 王明东 on 2017/3/30.
 */

fastmap.uikit.check.rule.voiceGuide_data_complete = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'voiceGuide_data_complete';
        this.description = '语音引导信息不完整，语音引导信息应该是完整的线点线关系';
    },

    check: function (editResult) {
        if (editResult.inLink && editResult.inNode && editResult.parts.length) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        return [result];
    }
});
