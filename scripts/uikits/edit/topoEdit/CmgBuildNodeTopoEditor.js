/**
 * Created by liuzhe on 2017/4/1.
 */

fastmap.uikit.topoEdit.CmgBuildNodeTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getCreateEditResult: function () {
        var editResult = new fastmap.uikit.shapeEdit.PointAddResult();
        editResult.geoLiveType = 'CMGBUILDNODE';
        editResult.linkType = 'CMGBUILDLINK';
        return editResult;
    },

    getModifyEditResult: function (options) {
        var editResult = new fastmap.uikit.shapeEdit.PointMoveResult();
        editResult.originObject = options.originObject;
        editResult.geoLiveType = 'CMGBUILDNODE';
        editResult.linkType = 'CMGBUILDLINK';
        editResult.finalGeometry = options.originObject.geometry;
        return editResult;
    },

    /**
     * 查询要素详细信息接口
     * 返回模型对象
     * @param options
     */
    query: function (options) {
        var pid = options.pid;
        var geoLiveType = options.geoLiveType;
        var p1 = this.dataService.getByPid(pid, geoLiveType, options.dbId);
        var param = {
            dbId: options.dbId,
            type: 'CMGBUILDLINK',
            data: {
                nodePid: pid
            }
        };
        var p2 = this.dataService.getByCondition(param)
                     .then(function (res) {
                         var links = [];
                         if (res) {
                             for (var i = 0; i < res.length; i++) {
                                 links.push(res[i].pid);
                             }
                         }
                         return links;
                     });
        return Promise.all([p1, p2]).then(function (res) {
            var data = res[0];
            if (!data) {
                return null;
            }

            var links = res[1];
            if (!links) {
                return null;
            }
            data.links = links;
            return data;
        });
    },

    create: function (editResult) {
        var point = editResult.finalGeometry;
        var linkPid = editResult.linkPid;
        var data = {
            longitude: point.coordinates[0],
            latitude: point.coordinates[1]
        };
        return this.dataService.createNode('CMGBUILDNODE', linkPid, data);
    },

    update: function (editResult) {
        var point = editResult.finalGeometry;
        var nodePid = editResult.originObject.pid;

        var data = {
            longitude: point.coordinates[0],
            latitude: point.coordinates[1]
        };
        return this.dataService.moveNode('CMGBUILDNODE', nodePid, data);
    }
});

