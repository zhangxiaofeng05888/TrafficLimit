/**
 * Created by 王明东 on 2017/3/30.
 */

fastmap.uikit.check.rule.voiceGuide_outLink_form_island = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'voiceGuide_outLink_form_island';
        this.description = '环岛不能作为语音引导的退出线';
    },

    check: function (editResult) {
        if (editResult.parts[editResult.currentPart]) {
            if (editResult.parts[editResult.currentPart].outLink.properties.form != '33') {
                return [];
            }
        } else {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
