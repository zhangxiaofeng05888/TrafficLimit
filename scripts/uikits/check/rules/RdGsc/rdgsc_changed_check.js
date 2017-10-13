/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.check.rule.rdgsc_changed_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'no_change';
        this.description = '未做任何修改，不需要保存';
    },

    check: function (editResult) {
        if (!editResult.originObject) {
            return [];
        }

        var i,
            j;
        var link,
            part;
        var f = false;
        for (i = 0; i < editResult.originObject.links.length; i++) {
            link = editResult.originObject.links[i];
            for (j = 0; j < editResult.parts.length; j++) {
                part = editResult.parts[j];
                if (link.linkPid == part.feature.properties.id && link.tableName.replace(/_/g, '') == part.feature.properties.geoLiveType && link.shpSeqNum == part.seqNum) {
                    if (link.zlevel != (j + 1)) {
                        f = true;
                        break;
                    }
                }
            }
        }

        if (f) {
            return [];
        }

        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'runtime';
        return [result];
    }
});
