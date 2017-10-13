/**
 * Created by wuzhen on 2017/4/9.
 */
fastmap.uikit.topoEdit.RDRoadTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
    initialize: function (map) {
        fastmap.uikit.topoEdit.TopoEditor.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /**
     * 创建工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getCreateEditResult: function (options) {
        var editResult = new fastmap.uikit.relationEdit.CrfRoadResult();
        editResult.geoLiveType = 'RDROAD';
        editResult.isCreate = true;
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * 备注:crf需要跨大区作业所以要先根据crf所在的外包矩形查询其所在的区库,然后在查询link
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.CrfRoadResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDROAD';
        var linkPids = [];
        for (var i = 0; i < obj.links.length; i++) {
            linkPids.push(obj.links[i].linkPid);
        }

        var rdRoadFeature = this.featureSelector.selectByFeatureId(obj.pid, 'RDROAD');
        var geometry = this.geometryAlgorithm.bbox(rdRoadFeature.geometry);
        geometry = this.geometryAlgorithm.bboxToPolygon(geometry);
        var wkt = {
            wkt: geometry
        };

        var self = this;
        var promise = this.dataService.queryDbIdByBbox(wkt).then(function (dbIds) {
            // dbIds = [13];
            var p = [];
            for (i = 0; i < dbIds.length; i++) {
                p.push(self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK', dbIds[i]).then(function (data) {
                    editResult.links = editResult.links.concat(self.getRealData(data));
                }));
            }
            return Promise.all(p);
        });

        return Promise.all([promise]).then(function () {
            editResult.links = FM.Util.uniqueBy(editResult.links, 'properties.id');
            return editResult;
        });
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var data = {
            linkPids: []
        };
        for (var i = 0; i < editResult.links.length; i++) {
            data.linkPids.push(editResult.links[i].properties.id);
        }
        return this.dataService.create('RDROAD', data);
    },

    /**
     * 更新接口
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var data = {
            objStatus: 'UPDATE',
            pid: editResult.originObject.pid,
            linkPids: []
        };
        for (var i = 0; i < editResult.links.length; i++) {
            data.linkPids.push(editResult.links[i].properties.id);
        }
        return this.dataService.update('RDROAD', data);
    }
});

