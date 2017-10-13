/**
 * Created by zhaohang on 2017/6/29.
 */
fastmap.uikit.check.rule.startEndTip_canPass_check = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'startEndTip_canPass_check';
        this.description = '经过线不连接，无法保存！';
    },

    check: function (editResult) {
        var result = new fastmap.uikit.check.CheckResult();
        result.message = this.description;
        result.geoLiveType = editResult.geoLiveType;
        result.situation = 'precheck';
        if (!editResult.startData || !editResult.endData) {
            return [];
        }
        var vias = editResult.vias;
        var startLink = editResult.startData.linkData;
        var endLink = editResult.endData.linkData;
        if (editResult.tipLinksSelect) {
            return [];
        }
        if (editResult.needVisaFlag) {
            if (vias.length === 0) {
                return [result];
            }
            if (this.uikitUtil.canHookByLink(startLink, vias[0]) && this.uikitUtil.canHookByLink(endLink, vias[vias.length - 1])) {
                return [];
            }
            return [result];
        }
        if (!editResult.needVisaFlag && vias.length === 0) {
            return [];
        }
        if (!editResult.needVisaFlag && (startLink.properties.id === endLink.properties.id)) {
            var snode = startLink.properties.snode;
            var enode = startLink.properties.enode;
            var otherNode = 0;
            if (snode === vias[0].properties.snode || snode === vias[0].properties.enode) {
                otherNode = enode;
            } else if (enode === vias[0].properties.snode || enode === vias[0].properties.enode) {
                otherNode = snode;
            } else {
                return [result];
            }
            if (otherNode === vias[vias.length - 1].properties.snode || otherNode === vias[vias.length - 1].properties.enode) {
                return [];
            }
            return [result];
        }
        if (!editResult.needVisaFlag) {
            var nodes = this.uikitUtil.getLinksNodes(startLink, endLink, vias);
            if ((nodes[0] === startLink.properties.snode || nodes[0] === startLink.properties.enode) && (nodes[1] === endLink.properties.snode || nodes[1] === endLink.properties.enode)) {
                return [];
            }
            return [result];
        }
        return [];
    }
});
