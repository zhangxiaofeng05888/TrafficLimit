/**
 * Created by linglong on 2017/9/6.
 */
fastmap.uikit.check.rule.two_link_is_not_same_enode_and_snode = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        this.id = 'two_link_is_not_same_enode_and_snode';
        this.description = '两个rdlink不能共用相同的起点和终点';
    },

    check: function (editResult) {
        if (editResult.geoLiveType === 'RDLINK') {
            var snapArray = [];
            for (var key in editResult.snapResults) {
                if (editResult.snapResults[key].type === 'FeatureSnapActor') {
                    if (editResult.snapResults[key].feature.properties.geoLiveType === 'RDLINK') {
                        snapArray.push(editResult.snapResults[key].feature.properties);
                    } else if (editResult.snapResults[key].feature.properties.geoLiveType === 'RDNODE') {
                        snapArray.push(editResult.snapResults[key].feature.properties);
                    }
                }
            }
            if (snapArray.length < 2) {
                return [];
            }
            for (var i = 0; i < snapArray.length; i++) {
                for (var j = i + 1; j < snapArray.length; j++) {
                    var current = snapArray[i];
                    var next = snapArray[j];
                    if (current.geoLiveType === 'RDLINK' && next.geoLiveType === 'RDLINK') {
                        if (current.id === next.id) {
                            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
                        }
                    }
                    if (current.geoLiveType === 'RDNODE' && next.geoLiveType === 'RDNODE') {
                        if (FM.Util.intersection(current.links, next.links).length) {
                            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
                        }
                    }
                    if (current.geoLiveType === 'RDNODE' && next.geoLiveType === 'RDLINK') {
                        if (current.links.indexOf(next.id) > -1) {
                            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
                        }
                    }
                    if (current.geoLiveType === 'RDLINK' && next.geoLiveType === 'RDNODE') {
                        if (next.links.indexOf(current.id) > -1) {
                            return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
                        }
                    }
                }
            }
        }
        return [];
    }
});
