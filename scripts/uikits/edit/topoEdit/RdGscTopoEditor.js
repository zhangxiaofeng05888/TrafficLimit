/**
 * Created by chenx on 2017/4/9.
 */
fastmap.uikit.topoEdit.RDGscTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.relationEdit.GradeSeperateCrossResult();
        editResult.geoLiveType = 'RDGSC';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.relationEdit.GradeSeperateCrossResult();
        var list = [];
        var i,
            j;
        for (i = 0; i < obj.links.length; i++) {
            list.push({
                feature: this.featureSelector.selectByFeatureId(obj.links[i].linkPid, obj.links[i].tableName.replace(/_/g, '')),
                seqNum: obj.links[i].shpSeqNum,
                zlevel: obj.links[i].zlevel
            });
        }
        var parts = this.uikitUtil.splitLinks(obj.geometry, list);
        for (i = 0; i < parts.length; i++) {
            for (j = 0; j < list.length; j++) {
                if (this.uikitUtil.isSameFeature(parts[i].feature, list[j].feature) && parts[i].seqNum == list[j].seqNum) {
                    parts[i].zlevel = list[j].zlevel;
                    break;
                }
            }
        }
        parts.sort(function (a, b) {
            return a.zlevel > b.zlevel ? 1 : -1;
        });
        editResult.originObject = obj;
        editResult.parts = parts;
        editResult.geoLiveType = 'RDGSC';
        editResult.operation = 'SortLink';
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var links = [];
        for (var i = 0; i < editResult.parts.length; i++) {
            links.push({
                pid: editResult.parts[i].feature.properties.id,
                type: editResult.parts[i].feature.properties.geoLiveType,
                zlevel: editResult.parts[i].zlevel,
                lineNum: editResult.parts[i].seqNum // 交点所在线段序号
            });
        }

        var data = {
            geometry: editResult.selectBox,
            gscPoint: {
                longitude: editResult.point.coordinates[0],
                latitude: editResult.point.coordinates[1]
            },
            linkObjs: links
        };
        return this.dataService.create('RDGSC', data);
    },

    update: function (editResult) {
        var origin = editResult.originObject;
        var i,
            j;
        var link,
            part;
        for (i = 0; i < origin.links.length; i++) {
            link = origin.links[i];
            for (j = 0; j < editResult.parts.length; j++) {
                part = editResult.parts[j];
                if (link.tableName.replace(/_/g, '') == part.feature.properties.geoLiveType && link.linkPid == part.feature.properties.id && link.shpSeqNum == part.seqNum) {
                    link.zlevel = part.zlevel;
                    break;
                }
            }
        }

        var data = origin.getChanges();
        if (data) {
            return this.dataService.update('RDGSC', origin.getChanges());
        }

        return Promise.resolve('属性值未发生变化');
    }
});
