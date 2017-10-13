fastmap.uikit.check.rule.shaping_check_face_selfintersect_face_when_link_to_face = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.id = 'shaping_check_face_selfintersect_face_when_link_to_face';
        this.description = '线构面形成的面不能自相交!';
    },

    check: function (editResult) {
        if (!editResult.topoLinks) { return []; }
        if (editResult.firstNodePid && editResult.firstNodePid === editResult.lastNodePid) {
            // 将所有线连接成一个面geoJson，然后判断其是否自相交;
            var tempLinks = [editResult.links[0]];
            var dirNode = tempLinks[0].properties.snode;
            for (var i = 1; i < editResult.links.length; i++) {
                var currentLink = editResult.links[i];
                var canPass = this.uikitUtil.canPass(currentLink, tempLinks[tempLinks.length - 1]);
                if (canPass) {
                    tempLinks.push(currentLink);
                    if (tempLinks.length === 2) {
                        if (tempLinks[0].properties.enode === tempLinks[1].properties.enode || tempLinks[0].properties.enode === tempLinks[1].properties.snode) {
                            dirNode = tempLinks[0].properties.enode;
                        } else if (tempLinks[0].properties.snode === tempLinks[1].properties.enode || tempLinks[0].properties.snode === tempLinks[1].properties.snode) {
                            dirNode = tempLinks[0].properties.snode;
                        }
                    }
                    continue;
                }
            }
            var newLinks = this._checkUpAndDown(tempLinks, dirNode);
            var ring = this.uikitUtil.createPath(newLinks);
            var isSimple = this.geometryAlgorithm.isSimple(ring);
            if (isSimple) {
                return [];
            }
            var result = new fastmap.uikit.check.CheckResult();
            result.message = this.description;
            result.geoLiveType = editResult.geoLiveType;
            result.situation = 'precheck';
            return [result];
        }
        return [];
    },

    _checkUpAndDown: function (tempLinks, dirNode) {
        var linkAttr = [];
        if (tempLinks.length == 1) {
            linkAttr = tempLinks[0].geometry.coordinates;
        } else {
            var linkArr = [];
            var nodePid = dirNode;
            for (var i = 0; i < tempLinks.length; i++) {
                if (tempLinks[i].properties.snode == nodePid) {
                    if (i == 0) {
                        var temp1 = tempLinks[i].geometry.coordinates.slice(0);
                        linkArr = linkArr.concat(temp1.reverse());
                    } else {
                        linkArr = linkArr.concat(tempLinks[i].geometry.coordinates);
                        nodePid = tempLinks[i].properties.enode;
                    }
                    continue;
                }
                if (tempLinks[i].properties.enode == nodePid) {
                    if (i == 0) {
                        linkArr = linkArr.concat(tempLinks[i].geometry.coordinates);
                    } else {
                        var temp2 = tempLinks[i].geometry.coordinates.slice(0);
                        linkArr = linkArr.concat(temp2.reverse());
                        nodePid = tempLinks[i].properties.snode;
                    }
                }
            }
            linkAttr = linkArr;
        }
        return linkAttr;
    }
});
