/**
 * Created by chenx on 2017/4/16.
 */

fastmap.uikit.check.rule.lane_connexity_runtime_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'lane_connexity_runtime_check';
        this.description = '车信编辑实时检查： [GLM19013, GLM19014, GLM19001_1, GLM01028_7]';
        this.ruleMap = {
            GLM19013: '环岛和特殊交通类型不可以作为车信的进入线',
            GLM19014: '路口车信的进入线和退出线不能是交叉口内link',
            GLM19001_1: '非引导道路不能是路口车信的进入线或退出线',
            GLM01028_7: '10级路/步行街/人渡不能是车信的进入、经过或退出线',
            PERMIT_CHECK_LANE_PASSLINKS_LESS15: '一条进入线和一条退出线之间，不能超过15条经过线'
        };
    },

    check: function (editResult) {
        var flag = true;
        var inKind,
            outKind,
            viaKind,
            inForm,
            outForm,
            viaForm;
        var results = [];
        var result = new fastmap.uikit.check.CheckResult();
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        results.push(result);
        if (editResult.inLink) {
            inKind = editResult.inLink.properties.kind;
            inForm = editResult.inLink.properties.form.split(';');
            if (editResult.inLink.properties.special === 1 || inForm.indexOf('33') >= 0) {
                result.message = this.ruleMap.GLM19013;
                return results;
            }

            if (inKind > 9 || inForm.indexOf('20') >= 0) {
                result.message = this.ruleMap.GLM01028_7;
                return results;
            }
        }

        var topo;
        var i,
            j;
        for (i = 0; i < editResult.topos.length; i++) {
            topo = editResult.topos[i];
            outForm = topo.outLink.properties.form.split(';');
            outKind = topo.outLink.properties.kind;
            if (topo.relationship === 1) {
                if (inKind === 9 || outKind === 9) {
                    result.message = this.ruleMap.GLM19001_1;
                    return results;
                }

                if (inForm.indexOf('50') >= 0 || outForm.indexOf('50') >= 0) {
                    result.message = this.ruleMap.GLM19014;
                    return results;
                }
            }

            if (outKind > 9 || outForm.indexOf('20') >= 0) {
                result.message = this.ruleMap.GLM01028_7;
                return results;
            }

            if (topo.viaLinks.length > 15) {
                result.message = this.ruleMap.PERMIT_CHECK_LANE_PASSLINKS_LESS15;
                return results;
            }

            for (j = 0; j < topo.viaLinks.length; j++) {
                viaKind = topo.viaLinks[j].properties.kind;
                viaForm = topo.viaLinks[j].properties.form.split(';');
                if (viaKind > 9 || viaForm.indexOf('20') >= 0) {
                    result.message = this.ruleMap.GLM01028_7;
                    return results;
                }
            }
        }

        return [];
    }
});
