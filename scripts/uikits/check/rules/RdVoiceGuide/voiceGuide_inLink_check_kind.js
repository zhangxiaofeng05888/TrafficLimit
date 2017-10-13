/**
 * Created by 王明东 on 2017/3/30.
 */

fastmap.uikit.check.rule.voiceGuide_inLink_check_kind = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'voiceGuide_inLink_check_kind';
        this.description = '9级路、10级路、步行街、人渡、高速道路、城市高速不能作为语音引导的进入线';
    },

    check: function (editResult) {
        if (editResult.inLink) {
            if (editResult.inLink.properties.kind != '9' && editResult.inLink.properties.kind != '10' &&
                editResult.inLink.properties.form != '20' && editResult.inLink.properties.kind != '11' &&
                editResult.inLink.properties.kind != '1' && editResult.inLink.properties.kind != '2') {
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
