/**
 * Created by chenx on 2017/4/25.
 */

fastmap.uikit.check.rule.rdgsc_link_form_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'PERMIT_CHECK_GSC_TUNNEL_ISLESS';
        this.description = '隧道形态的道路应在立交的最底层';
    },

    check: function (editResult) {
        var part;
        var result;
        for (var i = 0; i < editResult.parts.length; i++) {
            part = editResult.parts[i];
            if (part.feature.properties.geoLiveType === 'RDLINK' && part.feature.properties.form.split(';').indexOf('31') >= 0 && part.zlevel > 0) {
                result = new fastmap.uikit.check.CheckResult();
                result.message = this.description;
                result.geoLiveType = editResult.geoLiveType;
                result.situation = 'runtime';
                return [result];
            }
        }

        return [];
    }
});
