/**
 * Created by wuzhen on 2017/4/11.
 * crfOjbect(crf对象)
 */
fastmap.uikit.topoEdit.RDObjectTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.CrfObjectResult();
        editResult.geoLiveType = 'RDOBJECT';
        editResult.isCreate = true;
        return editResult;
    },

    getLinkPromise: function (links, dbId) {
        var promise = null;
        var linkPids = [];
        for (var i = 0; i < links.length; i++) {
            linkPids.push(links[i].linkPid);
        }
        if (linkPids.length > 0) {
            promise = this.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK', dbId);
        }
        return promise;
    },

    getInterPromise: function (inters, dbId) {
        var promise = null;
        var interPids = [];
        for (var i = 0; i < inters.length; i++) {
            interPids.push(inters[i].interPid);
        }
        if (interPids.length > 0) {
            promise = this.uikitUtil.getCanvasFeaturesFromServer(interPids, 'RDINTER', dbId);
        }
        return promise;
    },

    getBypids: function (pids, geoLiveType) {
        var self = this;
        return this.dataService.getByPids(pids, geoLiveType).then(function (data) {
            return self.unifyFeature(data);
        });
    },

    getRoadPromise: function (roads, dbId) {
        var promise = null;
        var roadPids = [];
        for (var i = 0; i < roads.length; i++) {
            roadPids.push(roads[i].roadPid);
        }
        if (roadPids.length > 0) {
            promise = this.uikitUtil.getCanvasFeaturesFromServer(roadPids, 'RDROAD', dbId);
        }
        return promise;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var i;
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.CrfObjectResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDOBJECT';
        editResult.isCreate = false;

        var linkPids = [];
        for (i = 0; i < obj.links.length; i++) {
            linkPids.push(obj.links[i].linkPid);
        }
        var interPids = [];
        for (i = 0; i < obj.inters.length; i++) {
            interPids.push(obj.inters[i].interPid);
        }
        var roadPids = [];
        for (i = 0; i < obj.roads.length; i++) {
            roadPids.push(obj.roads[i].roadPid);
        }

        var rdObjFeature = this.featureSelector.selectByFeatureId(obj.pid, 'RDOBJECT');
        var geometry = this.geometryAlgorithm.bbox(rdObjFeature.geometry);
        geometry = this.geometryAlgorithm.bboxToPolygon(geometry);
        var wkt = {
            wkt: geometry
        };

        var self = this;
        var promise = this.dataService.queryDbIdByBbox(wkt).then(function (dbIds) {
            var p = [];
            for (i = 0; i < dbIds.length; i++) {
                if (linkPids.length > 0) {
                    p.push(self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK', dbIds[i]).then(function (data) {
                        editResult.links = editResult.links.concat(self.getRealData(data));
                    }));
                }
                if (interPids.length > 0) {
                    p.push(self.uikitUtil.getCanvasFeaturesFromServer(interPids, 'RDINTER', dbIds[i]).then(function (data) {
                        editResult.inters = editResult.inters.concat(self.getRealData(data));
                    }));
                }
                if (roadPids.length > 0) {
                    p.push(self.uikitUtil.getCanvasFeaturesFromServer(roadPids, 'RDROAD', dbIds[i]).then(function (data) {
                        editResult.roads = editResult.roads.concat(self.getRealData(data));
                    }));
                }
            }
            return Promise.all(p);
        });

        return Promise.all([promise]).then(function () {
            editResult.links = FM.Util.uniqueBy(editResult.links, 'properties.id');
            editResult.inters = FM.Util.uniqueBy(editResult.inters, 'properties.id');
            editResult.roads = FM.Util.uniqueBy(editResult.roads, 'properties.id');
            return editResult;
        });
    },

    unifyFeature: function (features) {
        var _unify = function (feature) {
            var obj;
            if (feature instanceof FM.mapApi.render.data.DataModel) {
                obj = FM.extend({}, {
                    pid: feature.properties.id,
                    geometry: feature.geometry
                }, feature.properties);
            } else {
                obj = FM.extend({}, feature);
            }
            return new FM.dataApi.Feature(obj);
        };

        var ret;
        if (FM.Util.isObject(features)) {
            ret = _unify(features);
        } else if (FM.Util.isArray(features)) {
            ret = [];
            for (var i = 0; i < features.length; i++) {
                ret.push(_unify(features[i]));
            }
        } else {
            throw new Error('unifyObject: 不支持的数据类型');
        }
        return ret;
    },

    /**
     * 创建接口
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var i;
        var data = {
            links: [],
            inters: [],
            roads: []
        };
        for (i = 0; i < editResult.links.length; i++) {
            data.links.push(editResult.links[i].properties.id);
        }
        for (i = 0; i < editResult.inters.length; i++) {
            data.inters.push(editResult.inters[i].properties.id);
        }
        for (i = 0; i < editResult.roads.length; i++) {
            data.roads.push(editResult.roads[i].properties.id);
        }
        data.longitude = editResult.coordinate.longitude;
        data.latitude = editResult.coordinate.latitude;
        return this.dataService.create('RDOBJECT', data);
    },

    /**
     * 更新接口
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var i;
        var data = {
            objStatus: 'UPDATE',
            pid: editResult.originObject.pid,
            links: [],
            inters: [],
            roads: []
        };
        for (i = 0; i < editResult.links.length; i++) {
            data.links.push(editResult.links[i].properties.id);
        }
        for (i = 0; i < editResult.inters.length; i++) {
            data.inters.push(editResult.inters[i].properties.id);
        }
        for (i = 0; i < editResult.roads.length; i++) {
            data.roads.push(editResult.roads[i].properties.id);
        }
        data.geometry = {};
        data.geometry.longitude = editResult.coordinate.longitude;
        data.geometry.latitude = editResult.coordinate.latitude;
        return this.dataService.update('RDOBJECT', data);
    }
});

