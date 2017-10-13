/**
 * Created by 王明东 on 2017/3/30.
 */

fastmap.uikit.check.rule.voiceGuide_outLink_form_corss = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'voiceGuide_outLink_form_corss';
        this.description = '交叉点内道路不能作为语音引导的退出线';
    },

    check: function (editResult) {
        if (editResult.parts[editResult.currentPart]) {
            if (editResult.parts[editResult.currentPart].outLink.properties.form != '50') {
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
