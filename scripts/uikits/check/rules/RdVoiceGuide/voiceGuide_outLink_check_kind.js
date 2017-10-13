/**
 * Created by 王明东 on 2017/3/30.
 */

fastmap.uikit.check.rule.voiceGuide_outLink_check_kind = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'voiceGuide_outLink_check_kind';
        this.description = '9级路、10级路、步行街、人渡不能作为语音引导的退出线';
    },

    check: function (editResult) {
        if (editResult.parts.length) {
            if (editResult.parts[editResult.currentPart].outLink.properties.kind != '9' && editResult.parts[editResult.currentPart].outLink.properties.kind != '10' &&
                editResult.parts[editResult.currentPart].outLink.properties.form != '20' && editResult.parts[editResult.currentPart].outLink.properties.kind != '11') {
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
