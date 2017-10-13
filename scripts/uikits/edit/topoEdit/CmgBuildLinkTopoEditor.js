/**
 * Created by liuzhe on 2017/4/1.
 */

fastmap.uikit.topoEdit.CmgBuildLinkTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        editResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        editResult.geoLiveType = 'CMGBUILDLINK';
        editResult.snapActors = [{
            geoLiveType: 'CMGBUILDNODE',
            priority: 1,
            enable: true,
            exceptions: []
        }, {
            geoLiveType: 'CMGBUILDLINK',
            priority: 0,
            enable: true,
            exceptions: []
        }];
        return editResult;
    },

    getModifyEditResult: function (options) {
        var originObject = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        editResult.originObject = originObject;
        editResult.geoLiveType = 'CMGBUILDLINK';
        editResult.snapActors = [{
            geoLiveType: 'CMGBUILDNODE',
            priority: 1,
            enable: true,
            exceptions: [originObject.sNodePid, originObject.eNodePid]
        }, {
            geoLiveType: 'CMGBUILDLINK',
            priority: 0,
            enable: true,
            exceptions: [originObject.pid]
        }];
        editResult.snapNodeType = 'CMGBUILDNODE';
        editResult.snapLinkType = 'CMGBUILDLINK';
        editResult.finalGeometry = FM.Util.clone(options.originObject.geometry);
        return editResult;
    },

    create: function (editResult) {
        var sNodeSnap = editResult.snapResults[0];
        var eNodeSnap = editResult.snapResults[editResult.finalGeometry.coordinates.length - 1];
        var sNodePid = sNodeSnap && sNodeSnap.feature && sNodeSnap.feature.geometry.type === 'Point' ?
            sNodeSnap.feature.properties.id : 0;
        var eNodePid = eNodeSnap && eNodeSnap.feature && eNodeSnap.feature.geometry.type === 'Point' ?
            eNodeSnap.feature.properties.id : 0;
        var catchLinks = [];
        var keys = Object.getOwnPropertyNames(editResult.snapResults);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var index = parseInt(key, 10);
            var result = editResult.snapResults[key];
            var item = this.getCreateSnapParameter(index, result);
            if (item) {
                catchLinks.push(item);
            }
        }
        var data = {
            sNodePid: sNodePid,
            eNodePid: eNodePid,
            geometry: editResult.finalGeometry,
            catchLinks: catchLinks
        };
        return this.dataService.create('CMGBUILDLINK', data);
    },

    getCreateSnapParameter: function (index, result) {
        if (!result.feature) {
            return null;
        }

        var pid = result.feature.properties.id;
        var type = result.feature.geometry.type;
        if (type === 'Point') {
            return {
                nodePid: pid,
                seqNum: index
            };
        }

        return {
            linkPid: pid,
            lon: result.point.coordinates[0],
            lat: result.point.coordinates[1]
        };
    },

    isCoordinateEqual: function (coordinates1, coordinates2) {
        if (coordinates1[0] !== coordinates2[0]) {
            return false;
        }
        if (coordinates1[1] !== coordinates2[1]) {
            return false;
        }
        return true;
    },

    isSNodeMoved: function (editResult) {
        var ls1 = editResult.originObject.geometry;
        var ls2 = editResult.finalGeometry;

        if (!this.isCoordinateEqual(ls1.coordinates[0], ls2.coordinates[0])) {
            return true;
        }

        return false;
    },

    isENodeMoved: function (editResult) {
        var ls1 = editResult.originObject.geometry;
        var ls2 = editResult.finalGeometry;

        var length1 = ls1.coordinates.length;
        var length2 = ls2.coordinates.length;

        if (!this.isCoordinateEqual(ls1.coordinates[length1 - 1], ls2.coordinates[length2 - 1])) {
            return true;
        }

        return false;
    },

    update: function (editResult) {
        var sNodePid = editResult.originObject.sNodePid;
        var eNodePid = editResult.originObject.eNodePid;
        var sNodeSnap = editResult.snapResults[0];
        var eNodeSnap = editResult.snapResults[editResult.finalGeometry.coordinates.length - 1];
        var catchInfos = [];

        if (this.isSNodeMoved(editResult)) {
            var sNodeCatchInfo = this.getUpdateSNodeSnapParameter(sNodePid, sNodeSnap, editResult.finalGeometry);
            catchInfos.push(sNodeCatchInfo);
        }
        if (this.isENodeMoved(editResult)) {
            var eNodeCatchInfo = this.getUpdateENodeSnapParameter(eNodePid, eNodeSnap, editResult.finalGeometry);
            catchInfos.push(eNodeCatchInfo);
        }

        var objId = editResult.originObject.pid;

        var data = {
            type: 'CMGBUILDLINK',
            geometry: editResult.finalGeometry,
            catchInfos: catchInfos
        };
        return this.dataService.repair('CMGBUILDLINK', objId, data);
    },

    getUpdateSNodeSnapParameter: function (nodePid, snap, geometry) {
        if (!snap) {
            var coordinates = geometry.coordinates[0];
            return {
                nodePid: nodePid,
                longitude: coordinates[0],
                latitude: coordinates[1]
            };
        }

        if (!snap.feature) {
            return {
                nodePid: nodePid,
                longitude: snap.point.coordinates[0],
                latitude: snap.point.coordinates[1]
            };
        }

        return this.getUpdateSnapParameterFromFeatrue(snap.feature, snap.point, nodePid);
    },

    getUpdateENodeSnapParameter: function (nodePid, snap, geometry) {
        if (!snap) {
            var coordinates = geometry.coordinates[geometry.coordinates.length - 1];
            return {
                nodePid: nodePid,
                longitude: coordinates[0],
                latitude: coordinates[1]
            };
        }

        if (!snap.feature) {
            return {
                nodePid: nodePid,
                longitude: snap.point.coordinates[0],
                latitude: snap.point.coordinates[1]
            };
        }

        return this.getUpdateSnapParameterFromFeatrue(snap.feature, snap.point, nodePid);
    },

    getUpdateSnapParameterFromFeatrue: function (feature, point, nodePid) {
        if (feature.geometry.type === 'LineString') {
            return {
                nodePid: nodePid,
                catchLinkPid: feature.properties.id,
                longitude: point.coordinates[0],
                latitude: point.coordinates[1]
            };
        }

        return {
            nodePid: nodePid,
            catchNodePid: feature.properties.id
        };
    },

    getUpdateSnapParameterFromPoint: function (nodePid, point) {
        return {
            nodePid: nodePid,
            longitude: point.coordinates[0],
            latitude: point.coordinates[1]
        };
    }
});

