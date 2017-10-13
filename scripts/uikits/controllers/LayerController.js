/**
 * Created by liwanchong on 2015/9/16.
 */
fastmap.uikit.LayerController = (function () {
    var instantiated;

    function init(options) {
        var Controller = L.Class.extend({
            options: {},
            /**
             * @class LayerController
             * @constructor
             * @namespace fastmap.uikit
             * @param {Object}options
             */
            initialize: function (option) {
                L.setOptions(this, option);
                this.eventController = fastmap.uikit.EventController();
                this.config = this.options.config;
                this.layers = [];
                this.highLightLayersArr = [];
                this.zIndexQueue = [];
                this.maxZIndex = 1;
                this.reloadTileLayers = 0; // 加载完成瓦片图层
                this.loadedTileLayers = 0; // 可见的瓦片图层
                this.initLayer();
                this.eventController.on(this.eventController.eventTypes.LAYERONADD, this.OnAddLayer, this);
                this.eventController.on(this.eventController.eventTypes.LAYERONREMOVE, this.OnRemoveLayer, this);
                this.eventController.on(this.eventController.eventTypes.LAYERONSWITCH, this.OnSwitchLayer, this);
            },
            initLayer: function () {
                var that = this;
                var beforeLoadFunc = function () {
                    that.reloadTileLayers++;
                };
                var afterLoadFunc = function () {
                    that.loadedTileLayers++;
                    if (that.loadedTileLayers == that.reloadTileLayers) {
                        this.eventController.fire('AllTileLayerLoaded', null);
                    }
                };
                var g,
                    l,
                    zIndexObj,
                    tileLayer;
                for (g = 0; g < this.config.length; g++) {
                    for (l = 0; l < this.config[g].layers.length; l++) {
                        if (this.maxZIndex < (this.config[g].layers[l].options.zIndex)) {
                            this.maxZIndex = this.config[g].layers[l].options.zIndex + 1;
                        }
                        zIndexObj = {
                            id: this.config[g].layers[l].options.id,
                            zIndex: this.config[g].layers[l].options.zIndex
                        };
                        this.zIndexQueue.push(zIndexObj);
                        this.config[g].layers[l].options.groupId = this.config[g].groupId;
                        if (this.config[g].groupId == 'dataLayers') {
                            tileLayer = this.config[g].layers[l].clazz(this.createTileRequestObject(this.config[g].layers[l].url, this.config[g].layers[l].options), this.config[g].layers[l].options);
                            tileLayer.on('loading', beforeLoadFunc);
                            tileLayer.on('load', afterLoadFunc);
                            this.layers.push(tileLayer);
                        } else if (this.config[g].groupId == 'workLayers') {
                            tileLayer = this.config[g].layers[l].clazz(this.createTileRequestObjectForTips(this.config[g].layers[l].url, this.config[g].layers[l].options), this.config[g].layers[l].options);
                            tileLayer.on('loading', beforeLoadFunc);
                            tileLayer.on('load', afterLoadFunc);
                            this.layers.push(tileLayer);
                        } else {
                            this.layers.push(this.config[g].layers[l].clazz(this.config[g].layers[l].url, this.config[g].layers[l].options));
                        }
                    }
                }
            },
            /**
             * 图层显示隐藏转换方法
             * @method pushLayerFront
             * @param id
             */
            pushLayerFront: function (id) {
                this.pushLayerNormal();
                var layer = this.getLayerById(id);
                if (layer != null) {
                    layer.options.zIndex = this.maxZIndex;
                    layer.setZIndex(this.maxZIndex);
                }
                // this.OnSwitchLayer({layerArr: this.layers});
            },
            /**
             * 图层显示隐藏转换方法
             * @method pushLayerNormal
             */
            pushLayerNormal: function () {
                // 所有的都先归位，然后再设置最大的。
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].options.zIndex == this.maxZIndex) {
                        for (var j = 0; j < this.zIndexQueue.length; j++) {
                            if (this.zIndexQueue[j].id == this.layers[i].options.id) {
                                this.layers[i].options.zIndex = this.zIndexQueue[j].zIndex;
                                this.layers[i].setZIndex(this.zIndexQueue[j].zIndex);
                            }
                        }
                    }
                }
            },
            /**
             * 图层显示隐藏转换方法
             * @method OnSwitchLayer
             * @param event
             */
            OnSwitchLayer: function (event) {
                var layerArr = event.layerArr;
                for (var i = 0, len = layerArr.length; i < len; i++) {
                    this.eventController.fire(this.eventController.eventTypes.LAYERONSHOW, {
                        layer: layerArr[i]
                    });
                }
            },
            /**
             * 添加图层
             * @method OnAddLayer
             * @param layer
             * @constructor
             */
            OnAddLayer: function (layer) {
                this.layers.push(layer);
            },
            /**
             * 移除图层
             * @method OnRemoveLayer
             * @param {Layer}layer
             * @constructor
             */
            OnRemoveLayer: function (layer) {
                for (var item in this.layers) {
                    if (layer === this.layers[item]) {
                        this.layers.splice(item + 1, 1);
                    }
                }
            },
            /**
             * 显示或隐藏的图层
             * @method setLayerVisible
             * @param {Layer}layer
             * @param flag
             */
            setLayerVisible: function (layerId, visible) {
                var layer = this.getLayerById(layerId);
                layer.options.visible = visible === undefined ? true : visible;
                this.eventController.fire(this.eventController.eventTypes.LAYERONSHOW, {
                    layer: layer
                });
            },
            /**
             * 可编辑的图层
             * @method editLayer
             * @param {Layer}layer
             */
            setLayerEditable: function (layer, editable) {
                for (var item in this.layers) {
                    if (layer === this.layers[item]) {
                        this.layers.options.editable = true;
                        break;
                    }
                }
                this.eventController.fire(this.eventController.eventTypes.LAYERONEDIT, {
                    layer: layer
                });
            },
            /**
             * 获取可见图层
             * @method getVisibleLayers
             * @returns {Array}
             */
            getVisibleLayers: function () {
                var layers = [];
                for (var item in this.layers) {
                    if (this.layers[item].options.visible == true) {
                        layers.push(this.layers[item]);
                    }
                }
                return layers;
            },
            /**
             * 根据id获取图层
             * @method getLayerById
             * @param {String}id
             * @returns {L.TileLayer}
             */
            getLayerById: function (id) {
                var layer = null;
                for (var item in this.layers) {
                    if (this.layers[item].options) {
                        if (this.layers[item].options.id === id) {
                            layer = this.layers[item];
                        }
                    }
                }
                return layer;
            },
            highLightLayers: function (highLayer) {
                this.highLightLayersArr.push(highLayer);
            },
            removeHighLightLayer: function () {
                for (var i = 0, len = this.highLightLayersArr.length; i < len; i++) {
                    this.highLightLayersArr(i).clear();
                }
                this.highLightLayersArr.length = 0;
            },
            /**
             * 获取可选择的图层
             * @method getSelectableLayers
             * @returns {Array}
             */
            getSelectableLayers: function () {
                var layers = [];
                for (var item in this.layers) {
                    if (this.layers[item].options.selected == true) {
                        layers.push(this.layers[item]);
                    }
                }
                return layers;
            },
            /**
             * 获取可编辑的图层
             * @method getEditableLayers
             * @returns {Array}
             */
            getEditableLayers: function () {
                var layers = [];
                for (var item in this.layers) {
                    if (this.layers[item].options.editable == true) {
                        layers.push(this.layers[item]);
                    }
                }
                return layers;
            },
            /**
             * 根据要素类型获取所在的图层
             * @author chenx
             * @returns {Object}
             */
            getLayerByFeatureType: function (type) {
                var layer;
                for (var item in this.layers) {
                    if (this.layers[item].options.requestType && this.layers[item].options.requestType.split(',').indexOf(type) >= 0) {
                        layer = this.layers[item];
                        break;
                    }
                }
                return layer;
            },
            /**
             * 获取所有可见的tilejson图层
             * @returns {Array}
             */
            getAllTileJsonLayer: function () {
                var layers = [];
                for (var item in this.layers) {
                    if (!FM.Util.isEmptyObject(this.layers[item].tiles) && this.layers[item].options.visible == true) {
                        layers.push(this.layers[item]);
                    }
                }
                return layers;
            },
            getVisibleDataLayers: function () {
                var layers = [];
                for (var item in this.layers) {
                    if (this.layers[item].options.visible &&
                        // commited by chenx on 2017-3-6
                        // !FM.Util.isEmptyObject(this.layers[item].tiles) &&
                        (this.layers[item].options.groupId == 'dataLayers' || this.layers[item].options.groupId == 'workLayers')) {
                        layers.push(this.layers[item]);
                    }
                }
                return layers;
            },
            createTileRequestObject: function (url, layerOptions) {
                var reqObj = {};
                reqObj.url = App.Config.subdomainsServiceUrl + url;
                reqObj.parameter = {
                    dbId: App.Temp.dbId,
                    gap: layerOptions.gap || 10
                };
                if (layerOptions.requestType) {
                    if (layerOptions.id === 'thematicLink') {
                        reqObj.parameter.types = layerOptions.requestType.split(',');
                    } else {
                        reqObj.parameter.types = layerOptions.requestType.split(',');
                        if (reqObj.parameter.types.indexOf('RDLINK') >= 0 || reqObj.parameter.types.indexOf('RDLINKINTRTIC') >= 0) {
                            reqObj.hbaseUrl = reqObj.url;
                        }
                    }
                }
                return reqObj;
            },
            createTileRequestObjectForTips: function (url, layerOptions) {
                var reqObj = {};
                reqObj.url = App.Config.serviceUrl + url;
                reqObj.parameter = {
                    gap: layerOptions.gap || 10,
                    mdFlag: App.Temp.mdFlag
                };
                if (layerOptions.requestType) {
                    reqObj.parameter.types = layerOptions.requestType.split(',');
                }
                return reqObj;
            },
            // 根据要素类型重绘所在图层
            redrawLayers: function (featTypes) {
                var layer;
                for (var i = 0; i < featTypes.length; i++) {
                    // todo: 临时对策：如果是tips则刷新整个外业点图层
                    if (FM.uikit.Config.isTip(featTypes[i])) {
                        layer = this.getLayerById('workPoint');
                    } else if (featTypes[i] === 'RDLINK' && App.Temp.thematicMapType) {
                        layer = this.getLayerById('thematicLink');
                    } else {
                        layer = this.getLayerByFeatureType(featTypes[i]);
                    }

                    if (layer && layer.options.visible) {
                        layer.redraw();
                    }
                }
            },
            // 销毁单例
            destroy: function () {
                instantiated = null;
            }
        });
        return new Controller(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());
