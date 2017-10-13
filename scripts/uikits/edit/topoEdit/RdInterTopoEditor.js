/**
 * Created by wuzhen on 2017/4/1.
 */
fastmap.uikit.topoEdit.RDInterTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.CrfInterResult();
        editResult.geoLiveType = 'RDINTER';
        editResult.isCreate = true;
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     *
     * crf对象比较大并且存在扩大区作业，所以先根据crf所在的外包矩形查询其所在的区库id,然后在查询对应的link和node。
     * crfi有个特殊的地方，就是图廓点不能参与制作crfi，但是图廓点挂接的link可以参与制作crfi，所以在查询node点时要分两部分查询，
     * 一部分是crfi返回的node，另一部分是crfi对应的link的端点node（正常情况下node都可以返回，但是图廓点不能参与制作,所以图廓点的node需要根据link计算）
     *
     * @param options getbypid返回的数据
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.CrfInterResult();
        editResult.originObject = obj;
        editResult.geoLiveType = 'RDINTER';
        var i = 0;
        var nodePids = [];
        var linkPids = [];
        var linkNodePids = [];
        for (i = 0; i < obj.nodes.length; i++) {
            nodePids.push(obj.nodes[i].nodePid);
        }
        for (i = 0; i < obj.links.length; i++) {
            linkPids.push(obj.links[i].linkPid);
        }

        var rdInterFeature = this.featureSelector.selectByFeatureId(obj.pid, 'RDINTER');
        var geometry = this.geometryAlgorithm.bbox(rdInterFeature.geometry);
        geometry = this.geometryAlgorithm.bboxToPolygon(geometry);
        var wkt = {
            wkt: geometry
        };

        var dbIdArr = [];
        var self = this;
        var promise = this.dataService.queryDbIdByBbox(wkt).then(function (dbIds) {
            dbIdArr = dbIds;
            var p = [];
            for (i = 0; i < dbIds.length; i++) {
                var dbId = dbIds[i];
                p.push(self.uikitUtil.getCanvasFeaturesFromServer(nodePids, 'RDNODE', dbId).then(function (data) {
                    editResult.nodes = editResult.nodes.concat(self.getRealData(data));
                }));
                if (linkPids.length > 0) { // 有可能linkpids为空
                    p.push(self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK', dbId).then(function (data) {
                        editResult.links = editResult.links.concat(self.getRealData(data));
                    }));
                }
            }
            return Promise.all(p).then(function () {
                editResult.nodes = FM.Util.uniqueBy(editResult.nodes, 'properties.id'); // 正常数据是不会有重复的，开发环境存在错误数据，因此增加去重
                editResult.links = FM.Util.uniqueBy(editResult.links, 'properties.id');
                var arr = [];
                if (editResult.links.length > 0) { // 查询图廓点的node信息
                    for (i = 0; i < editResult.links.length; i++) {
                        linkNodePids.push(editResult.links[i].properties.enode);
                        linkNodePids.push(editResult.links[i].properties.snode);
                    }
                    linkNodePids = FM.Util.getRepeat(linkNodePids);
                    linkNodePids = FM.Util.difference(linkNodePids, nodePids);
                    if (linkNodePids.length > 0) {
                        for (i = 0; i < dbIds.length; i++) {
                            arr.push(self.uikitUtil.getCanvasFeaturesFromServer(linkNodePids, 'RDNODE', dbIds[i]).then(function (data) {
                                editResult.nodes = editResult.nodes.concat(self.getRealData(data));
                            }));
                        }
                    }
                }
                return Promise.all(arr).then(function () {
                    if (dbIdArr.length > 1) { // 跨大区才需要处理
                        editResult.nodes = self.meargeNode(editResult.nodes);// 本应需要服务解决，由于不能快速对应，前端先进行临时解决,服务解决后需要注销掉此行代码
                    }
                });
            });
        });
        return Promise.all([promise]).then(function () {
            editResult.nodes = FM.Util.uniqueBy(editResult.nodes, 'properties.id'); // 正常数据是不会有重复的，开发环境存在错误数据，因此增加去重
            editResult.links = FM.Util.uniqueBy(editResult.links, 'properties.id');
            return editResult;
        });
    },

    /**
     * 合并相同node的linkId
     *
     * 写这个方法是用来处理跨大区时，crfi包含图廓点时，如果这个图廓点挂接多个大区的多条link，服务接口没有返回这个node挂接的所有link，web端进行linkid的合并
     *
     * node中的数据格式和渲染格式应该要保持一致的，但是实际服务的getobject接口和渲染接口对于跨大区的crfi中的node中link属性返回的不一致，所以前端进行了处理，最好还是服务接口返回前端就不用处理了
     *
     * @method  meargeNode
     * @author wuzhen
     * @date 2017-09-13
     * @param node crf对应的node的数组
     * @example [{properties:{id:11, links[111]}},{properties:{id:11, links[222]}}] 返回 [{properties:{id:11, links[111,222]}}]
     * @returns {Array}
     */
    meargeNode: function (nodes) {
        for (var i = 0; i < nodes.length - 1; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                if (nodes[i].properties.id == nodes[j].properties.id) {
                    nodes[i].properties.links = nodes[i].properties.links.concat(nodes[j].properties.links);
                    nodes.splice(j, 1);
                    j--;
                    i--;
                    break;
                }
            }
        }
        return nodes;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var i = 0;
        var data = {
            links: [],
            nodes: []
        };
        for (i = 0; i < editResult.nodes.length; i++) {
            data.nodes.push(editResult.nodes[i].properties.id);
        }
        for (i = 0; i < editResult.links.length; i++) {
            data.links.push(editResult.links[i].properties.id);
        }
        return this.dataService.create('RDINTER', data);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var i = 0;
        var data = {
            objStatus: 'UPDATE',
            pid: editResult.originObject.pid,
            links: [],
            nodes: []
        };
        for (i = 0; i < editResult.nodes.length; i++) {
            data.nodes.push(editResult.nodes[i].properties.id);
        }
        for (i = 0; i < editResult.links.length; i++) {
            data.links.push(editResult.links[i].properties.id);
        }
        return this.dataService.update('RDINTER', data);
    }
});

