/**
 * Created by wuzhen on 2017/3/27.
 */
fastmap.uikit.topoEdit.IxPoiTopoEditor = fastmap.uikit.topoEdit.TopoEditor.extend({
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
        var editResult = new fastmap.uikit.shapeEdit.IxPoiResult();
        editResult.geoLiveType = 'IXPOI';
        return editResult;
    },

    /**
     * 修改工具需要使用的EditResult
     * @param options
     * @returns {null}
     */
    getModifyEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.shapeEdit.IxPoiResult();
        editResult.geoLiveType = 'IXPOI';
        editResult.originObject = obj;
        editResult.coordinate = obj.geometry;
        editResult.guide = {
            type: 'Point',
            coordinates: [obj.xGuide, obj.yGuide]
        };
        editResult.guideLink = {
            geometry: {},
            properties: {
                id: obj.linkPid,
                form: '--' // 新建poi是对引导link的formOfWay有校验，所以需要加上此属性
            }
        };
        editResult.rawFields = obj.rawFields;
        editResult.kindCode = '--';
        editResult.name = '--'; // 因为新建和修改使用的是同一个EditResultOperation,而poi新建时要对名称和分类进行非空校验，此处默认值’--‘就是为了避免错误数据引起的校验不通过
        return editResult;
    },

    getParentEditResult: function (options) {
        var obj = options.originObject;
        var editResult = new fastmap.uikit.complexEdit.PoiParentResult();
        editResult.geoLiveType = 'IXPOIPARENT';
        editResult.originObject = obj;
        return editResult;
    },

    getModifySamePoiResult: function (options) {
        var editResult = new fastmap.uikit.complexEdit.SamePoiResult();
        editResult.geoLiveType = 'IXPOISAME';
        editResult.originObject = options.originObject;
        return editResult;
    },

    /**
     * 创建接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    create: function (editResult) {
        var linkPid = editResult.guideLink.properties.id;
        if (editResult.tipOrLinkFlag === 2) {
            linkPid = 0;
        }
        var param = {
            longitude: editResult.coordinate.coordinates[0],
            latitude: editResult.coordinate.coordinates[1],
            x_guide: editResult.guide.coordinates[0],
            y_guide: editResult.guide.coordinates[1],
            linkPid: linkPid,
            name: editResult.name,
            kindCode: editResult.kindCode
        };
        return this.dataService.createPOI('IXPOI', param);
    },

    /**
     * 更新接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    update: function (editResult) {
        var linkPid = editResult.guideLink.properties.id;
        if (editResult.tipOrLinkFlag === 2) {
            linkPid = 0;
        }
        var param = {
            objId: editResult.originObject.pid,
            data: {
                longitude: editResult.coordinate.coordinates[0],
                latitude: editResult.coordinate.coordinates[1],
                x_guide: editResult.guide.coordinates[0],
                y_guide: editResult.guide.coordinates[1],
                linkPid: linkPid,
                rawFields: editResult.rawFields.join('|')
            }
        };
        return this.dataService.movePOI('IXPOI', param);
    },

    /**
     * 修改父子关系接口
     * 子类需要重写此方法
     * @param editResult 编辑结果
     */
    updateParent: function (editResult) {
        var param = {};
        param.pid = editResult.originObject.pid;
        if (editResult.operFlag === 1) { // 1新增 2删除 3修改
            param.parentPid = editResult.parentPid;
            return this.dataService.createParent(param);
        } else if (editResult.operFlag === 2) {
            return this.dataService.deleteParent(param);
        } else if (editResult.operFlag === 3) {
            param.parentPid = editResult.parentPid;
            return this.dataService.updateParent(param);
        }
        return null;
    },

    updateSamePoi: function (editResult) {
        var param = {};
        param.pids = editResult.samePids;
        return this.dataService.createSamePoi(param);
    },

    /**
     * 判断模型数是否可以进行编辑操作
     * 原则：已经是删除状态的数据不可再编辑
     * @param  {IxPoi} modelData    poi数据
     * @return {Boolean}           是否可删除
     */
    canEdit: function (modelData) {
        if (modelData && modelData.state === 2) {
            return false;
        }

        return true;
    },

    /**
     * 判断模型数是否可以执行删除操作
     * 原则：已经是删除状态的数据不可再删除
     * @param  {IxPoi} modelData    poi数据
     * @return {Boolean}           是否可删除
     */
    canDelete: function (modelData) {
        if (modelData && modelData.state === 2) {
            return false;
        }

        return true;
    }
});

