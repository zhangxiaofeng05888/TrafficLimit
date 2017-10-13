/**
 * Created by 王明东 on 2017/3/23.
 */

fastmap.uikit.check.rule.electronicEye_add_pair = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'electronicEye_add_pair';
        this.description = '配对电子眼必须是区间测速开始和区间测速结束';
    },

    check: function (editResult) {
        if (editResult.type != 'AddPairElectronicEyeResult') {
            return [];
        }
        if (editResult.originObject.kind == 20 && editResult.pairFeature.kind == 21) {
            return [];
        }
        if (editResult.originObject.kind == 21 && editResult.pairFeature.kind == 20) {
            return [];
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
