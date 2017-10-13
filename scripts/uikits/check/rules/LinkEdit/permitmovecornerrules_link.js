/**
 * Created by linglong on 2017/4/9.
 */
fastmap.uikit.check.rule.permitmovecornerrules_link = fastmap.uikit.check.CheckRule.extend({
    initialize: function (options) {
        fastmap.uikit.check.CheckRule.prototype.initialize.call(this);
        this.Id = 'permitmovecornerrules_link';
        this.description = '该点是角点，不能移动';
    },

    check: function (editResult) {
        if (!editResult.finalGeometry) {
            return [];
        }
        if (!editResult.originObject) {
            return [];
        }
        
        var originLinkGeo = editResult.originObject.geometry.coordinates;
        var linkGeo = editResult.finalGeometry.coordinates;

        if (linkGeo.length < 2) {
            return [];
        }

        var cond1 = false;
        var cond2 = false;
        var meshArr = [];
        var cornerArr = [];
        var currentFirstNode = this.uikitUtil.createPoint(linkGeo[0]);
        var currentLastNode = this.uikitUtil.createPoint(linkGeo[linkGeo.length - 1]);
        var originFirstNode = this.uikitUtil.createPoint(originLinkGeo[0]);
        var originLastNode = this.uikitUtil.createPoint(originLinkGeo[originLinkGeo.length - 1]);

        var meshLayer = fastmap.mapApi.meshLayer();
        for (var i = 0; i < linkGeo.length; i++) {
            var meshId = meshLayer.Calculate25TMeshId({ lng: linkGeo[i][0], lat: linkGeo[i][1] });
            if (meshArr.indexOf(meshId) === -1) {
                meshArr.push(meshId);
            }
        }
        for (var j = 0; j < meshArr.length; j++) {
            var arr = meshLayer.Calculate25TMeshBorder(meshId);
            cornerArr = cornerArr.concat(this.convertBoxToFourPoint(arr));
        }

        for (var n = 0; n < cornerArr.length; n++) {
            cond1 = this.uikitUtil.isSamePoint(cornerArr[n], originFirstNode) ||
                this.uikitUtil.isSamePoint(cornerArr[n], originLastNode);
            if (cond1) { break; }
        }

        for (var k = 0; k < cornerArr.length; k++) {
            cond2 = this.uikitUtil.isSamePoint(cornerArr[k], currentFirstNode) ||
                this.uikitUtil.isSamePoint(cornerArr[k], currentLastNode);
            if (cond2) { break; }
        }

        if (cond1) {
            if (!cond2) {
                return [this.getCheckResult(this.description, editResult.geoLiveType, 'runtime')];
            }
        }

        return [];
    },

    convertBoxToFourPoint: function (range) {
        return [
            this.uikitUtil.createPoint([range.maxLon, range.maxLat]),
            this.uikitUtil.createPoint([range.minLon, range.maxLat]),
            this.uikitUtil.createPoint([range.maxLon, range.minLat]),
            this.uikitUtil.createPoint([range.minLon, range.minLat])
        ];
    }
});
