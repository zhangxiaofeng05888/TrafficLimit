/**
 * Created by zhaohang on 2017/10/16.
 */

fastmap.uikit.topoEdit.CopyToPolygonTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.eventController = fastmap.uikit.EventController();
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.shapeEdit.PathResult();
        editResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        editResult.geoLiveType = 'COPYTOPOLYGON';
        editResult.snapActors = [{
            geoLiveType: 'COPYTOPOLYGON',
            priority: 1,
            enable: true,
            exceptions: []
        }];
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var params = {
            type: 'SCPLATERESFACE',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId,
                geometry: editResult.finalGeometry
            }
        };
        return this.dataServiceFcc.copyToLine(params);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCopyResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.CopyResult();
        editResult.geoLiveType = 'COPYTOPOLYGON';
        editResult.types = ['RDLINK', 'ADLINK'];
        return editResult;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    copy: function (editResult) {
        var rdLinks = [];
        var adLinks = [];
        for (var i = 0; i < editResult.links.length; i++) {
            if (editResult.links[i].properties.geoLiveType === 'RDLINK') {
                rdLinks.push(editResult.links[i].properties.id);
            } else {
                adLinks.push(editResult.links[i].properties.id);
            }
        }
        var params = {
            type: 'SCPLATERESFACE',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId
            }
        };
        if (rdLinks.length > 0) {
            params.data.rdlinks = rdLinks;
        }
        if (adLinks.length > 0) {
            params.data.adlinks = adLinks;
        }
        return this.dataServiceFcc.copyToLine(params);
    }
});

