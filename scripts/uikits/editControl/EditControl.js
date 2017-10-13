/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.EditControl = L.Class.extend({
    initialize: function (map) {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.map = map;
        this.toolController = fastmap.uikit.ToolController.getInstance();
        this.highlightController = FM.mapApi.render.HighlightController.getInstance();
        this.feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
        this.topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.eventController = fastmap.uikit.EventController();
        this.outPutController = fastmap.uikit.OutPutController();
        this.sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.editControlFactory = fastmap.uikit.editControl.EditControlFactory.getInstance();

        this.status = 'Ready';
    },

    run: function () {
        this.highlightController.clear();

        // this.changeScene(this.geoLiveType);
        this.loadDependLayers(this.geoLiveType);

        this.setCurrentControl(this);

        this.status = 'Running';

        return true;
    },

    changeScene: function (geoLiveType) {
        this.sceneController.changeScene(geoLiveType);
    },

    setCurrentControl: function (control) {
        if (this.editControlFactory.currentControl) {
            this.editControlFactory.currentControl.abort();
        }
        this.editControlFactory.currentControl = control;
    },

    abort: function () {
        this.status = 'Aborted';
    },

    precheck: function (editResult) {
        var errmsg = editResult.check('precheck');
        if (errmsg !== '') {
            swal(errmsg);
            return false;
        }
        return true;
    },

    getChangedGeoLiveTypes: function (geoLiveType, logs) {
        var config = FM.uikit.Config.Feature();
        var geoLiveTypes = [];
        var log,
            type,
            geoType,
            uiGeoTypes;
        for (var i = 0; i < logs.length; ++i) {
            log = logs[i];
            type = log.type;
            geoType = this.getMainFeatureGeoLiveType(type);
            if (geoType) {
                geoLiveTypes.push(geoType);
            }

            uiGeoTypes = config.getUIFeatureTypes(type);
            Array.prototype.push.apply(geoLiveTypes, uiGeoTypes);
        }

        var dependOns = FM.uikit.Config.getDependOn(geoLiveType); // 依赖于此要素的其他要素
        Array.prototype.push.apply(geoLiveTypes, dependOns);

        geoLiveTypes.push(geoLiveType); // 当前编辑的要素

        geoLiveTypes = FM.Util.unique(geoLiveTypes);

        return geoLiveTypes;
    },

    getMainFeatureGeoLiveType: function (geoLiveType) {
        var mapping = FM.uikit.Config.Feature().getMapping();
        var keys = Object.getOwnPropertyNames(mapping);
        for (var i = 0; i < keys.length; ++i) {
            var tmpGeoLiveType = keys[i];
            if (geoLiveType.indexOf(keys[i]) !== -1) {
                return tmpGeoLiveType;
            }
        }

        return null;
    },

    outputLogs: function (logs) {
        for (var i = 0; i < logs.length; ++i) {
            this.outPutController.add(logs[i]);
        }
    },

    loadDependLayers: function (geoLiveType) {
        var types = FM.uikit.Config.getDepends(geoLiveType);
        types.push(geoLiveType);
        FM.Util.unique(types);

        var layers = [];
        var temp;
        var f;
        var i,
            j;
        for (i = 0; i < types.length; i++) {
            temp = this.sceneController.getLayersByFeatureType(types[i]);
            f = false;
            for (j = 0; j < temp.length; j++) {
                if (this.sceneController.isLayerLoaded(temp[j].id)) {
                    f = true;
                    break;
                }
            }
            if (!f && temp.length > 0) {
                // todo: 这里要处理一种要素被加载到多个个图层上（如rdlink）的情况
                // 暂时先取第一个
                layers.push(temp[0]);
            }
        }

        // 删除多余的临时图层
        var tmpLayers = this.sceneController.getTemporaryLayers();
        var delLayerIds = [];
        for (i = 0; i < tmpLayers.length; i++) {
            if (types.indexOf(tmpLayers[i].getFeatureType()) === -1) {
                delLayerIds.push(tmpLayers[i].id);
            }
        }
        if (delLayerIds.length > 0) {
            this.sceneController.removeFromScene(delLayerIds);
        }

        // 加载缺少的依赖图层
        if (layers.length > 0) {
            this.sceneController.addToTemporary(layers);
        }
    }
});
