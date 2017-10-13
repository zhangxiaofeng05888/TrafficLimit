/**
 * Created by zhongxiaoming on 2017/4/9.
 */
FM.uikit.Config = FM.uikit.Config || {};

// 单例，只读 情报适量化tips工具
FM.uikit.Config.InfoTip = (function () {
    var instance;

    var Singleton = function () {
        var config = {
            TIPTOLLGATE: {
                name: '收费站',
                serverFeatureType: '',
                model: fastmap.dataApi.tipTollGate,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoTollGate_ctrl/infoTollGateCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoTollGate_tpl/infoTollGateTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPROADTYPE: {
                name: '道路种别',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRoadType,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRoadType_ctrl/infoRoadTypeCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRoadType_tpl/infoRoadTypeTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPTRAFFICSIGNAL: {
                name: '红绿灯',
                serverFeatureType: '',
                model: fastmap.dataApi.tipTrafficSignal,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoTrafficSignal_ctrl/infoTrafficSignal.js',
                        tmpl: 'components/infos/tpls/attr_infoTrafficSignal_tpl/infoTrafficSignalTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPDRIVEWAYMOUNT: {
                name: '车道数',
                serverFeatureType: '',
                model: fastmap.dataApi.tipDrivewayMount,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoDrivewayMount_ctrl/infoDrivewayMountCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoDrivewayMount_tpl/infoDrivewayMountTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPRESTRICTION: {
                name: '点限速',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRestriction,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRestriction_ctrl/infoRestriction.js',
                        tmpl: 'components/infos/tpls/attr_infoRestriction_tpl/infoRestrictionTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPRAMP: {
                name: '匝道',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRamp,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRamp_ctrl/infoRampCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRamp_tpl/infoRampTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPROADSA: {
                name: 'SA',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRoadSA,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRoadSA_tpl/infoRoadSACtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRoadSA_tpl/infoRoadSATmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPROADPA: {
                name: 'PA',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRoadPA,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRoadPA_ctrl/infoRoadPACtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRoadPA_tpl/infoRoadPATmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPROADDIRECTION: {
                name: '道路方向',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRoadDirection,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRoadDirection_ctrl/infoRoadDirectionCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRoadDirection_tpl/infoRoadDirectionTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPRAILWAYCROSSING: {
                name: '铁路道口',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRailwayCrossing,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_railwayCrossing_ctrl/railwayCrossingCtrl.js',
                        tmpl: 'components/infos/tpls/attr_railwayCrossing_tpl/railwayCrossingTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPMULTIDIGITIZED: {
                name: '上下线分离',
                serverFeatureType: '',
                model: fastmap.dataApi.tipMultiDigitized,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoMultiDigitized_ctrl/infoMultiDigitizedCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoMultiDigitized_tpl/infoMultiDigitizedTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPPEDESTRIANSTREET: {
                name: '步行街',
                serverFeatureType: '',
                model: fastmap.dataApi.tipPedestrianStreet,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoPedestrianStreet_ctrl/infoPedestrianStreetCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoPedestrianStreet_tpl/infoPedestrianStreetTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPBUSLANE: {
                name: '公交专用车道',
                serverFeatureType: '',
                model: fastmap.dataApi.tipBusLane,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoBusLane_ctrl/infoBusLaneCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoBusLane_tpl/infoBusLaneTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPBRIDGE: {
                name: '桥',
                serverFeatureType: '',
                model: fastmap.dataApi.tipBridge,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoBridge_ctrl/infoBridgeCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoBridge_tpl/infoBridgeTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPTUNNEL: {
                name: '隧道',
                serverFeatureType: '',
                model: fastmap.dataApi.tipTunnel,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoTunnel_ctrl/infoTunnelCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoTunnel_tpl/infoTunnelTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPMAINTENANCE: {
                name: '施工',
                serverFeatureType: '',
                model: fastmap.dataApi.tipMaintenance,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoMaintenance_ctrl/infoMaintenanceCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoMaintenance_tpl/infoMaintenanceTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPROADNAME: {
                name: '道路名',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRoadName,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRoadName_ctrl/infoRoadNameCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRoadName_tpl/infoRoadNameTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPLINKS: {
                name: '测线',
                serverFeatureType: '',
                model: fastmap.dataApi.tipLinks,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoLinks_ctrl/infoLinksCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoLinks_tpl/infoLinksTmpl.html'
                    }
                },
                editTools: ['UPDATE', 'BREAK', 'COPY'] // 地图操作工具列表
            },
            TIPDELETETAG: {
                name: '删除标记',
                serverFeatureType: '',
                model: fastmap.dataApi.tipDeleteTag,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoDeleteTag_ctrl/infoDeleteTagCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoDeleteTag_tpl/infoDeleteTagTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },
            TIPROUNDABOUT: {
                name: '环岛',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRoundabout,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRoundabout_ctrl/infoRoundaboutCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRoundabout_tpl/infoRoundaboutTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPCONNECT: {
                name: '挂接',
                serverFeatureType: '',
                model: fastmap.dataApi.tipConnect,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoConnect_ctrl/infoConnectCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoConnect_tpl/infoConnectTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPLANECONNEXITY: {
                name: '车信',
                serverFeatureType: '',
                model: fastmap.dataApi.tipLaneConnexity,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoLaneConnexity_ctrl/infoLaneConnexityCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoLaneConnexit_tpl/infoLaneConnexityTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPREGIONROAD: {
                name: '区域内道路',
                serverFeatureType: '',
                model: fastmap.dataApi.tipRegionRoad,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoRegionRoad_ctrl/infoRegionRoadCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoRegionRoad_tpl/infoRegionRoadTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPSKETCH: {
                name: '草图',
                serverFeatureType: '',
                model: fastmap.dataApi.tipSketch,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoSketch_ctrl/infoSketchCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoSketch_tpl/infoSketchTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPGPSDOT: {
                name: 'GPS打点',
                serverFeatureType: '',
                model: fastmap.dataApi.tipGPSDot,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoGPSDot_ctrl/infoGPSDotCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoGPSDot_tpl/infoGPSDotTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPHIGHWAYCONNECT: {
                name: 'GPS打点',
                serverFeatureType: '',
                model: fastmap.dataApi.tipHighWayConnect,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoHighWayConnect_ctrl/infoHighWayConnectCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoHighWayConnect_tpl/infoHighWayConnectTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPNOMALRESTRICTION: {
                name: '普通交限',
                serverFeatureType: '',
                model: fastmap.dataApi.tipNomalRestriction,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoNomalRestriction_ctrl/infoNomalRestrictionCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoNomalRestriction_tpl/infoNomalRestrictionTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },
            TIPGSC: {
                name: '立交',
                serverFeatureType: '',
                model: fastmap.dataApi.tipGSC,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoGSC_ctrl/infoGSCCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoGSC_tpl/infoGSCTmpl.html'
                    }
                },
                editTools: ['UPDATE'] // 地图操作工具列表
            },

            TIPDELETEPROPERTYINPROGRESS: {
                name: 'DELETEPROPERTYINPROGRESS',
                serverFeatureType: '',
                model: fastmap.dataApi.tipDeletePropertyInProgress,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoDeletePropertyInProgress_ctrl/infoDeletePropertyInProgressCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoDeletePropertyInProgress_tpl/infoDeletePropertyInProgressTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            },

            TIPBUILDTIMECHANGE: {
                name: '在建时间变更',
                serverFeatureType: '',
                model: fastmap.dataApi.tipBuildTimeChange,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/infos/ctrls/attr_infoBuildTimeChange_ctrl/infoBuildTimeChangeCtrl.js',
                        tmpl: 'components/infos/tpls/attr_infoBuildTimeChange_tpl/infoBuildTimeChangeTmpl.html'
                    }
                },
                editTools: ['MODIFY'] // 地图操作工具列表
            }
        };
        var linkNodeConf = {
            RDNODE: 'RDLINK',
            RWNODE: 'RWLINK',
            LUNODE: 'LULINK',
            LCNODE: 'LCLINK',
            ADNODE: 'ADLINK',
            ZONENODE: 'ZONELINK'
        };
        this.getConfig = function (featType) {
            var conf = config[featType];
            if (!conf) {
                return null;
            }
            return conf;
        };
        this.getName = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.name) {
                return null;
            }
            return conf.name;
        };
        this.getAddTemplate = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.template) {
                return null;
            }
            if (!conf.template.add) {
                return null;
            }
            return conf.template.add;
        };
        this.getEditTemplate = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.template) {
                return null;
            }
            if (!conf.template.edit) {
                return null;
            }
            return conf.template.edit;
        };
        this.getViewTemplate = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.template) {
                return null;
            }
            if (!conf.template.view) {
                return null;
            }
            return conf.template.view;
        };
        this.getEditTools = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            var tools = [];
            if (conf.editTools) {
                Array.prototype.push.apply(tools, conf.editTools);
            }
            if (tools.length === 0) {
                return null;
            }
            return tools;
        };
        this.getTable = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.table) {
                return null;
            }
            return conf.table;
        };
        this.getExtendTemplate = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.template) {
                return null;
            }
            if (!conf.template.extend) {
                return null;
            }
            return conf.template.extend;
        };
        this.getDataModel = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.model) {
                return null;
            }
            return conf.model;
        };
        this.getDepends = function (featType) {
            var depends = [];
            var conf = this.getConfig(featType);
            if (!conf) {
                return depends;
            }
            if (conf.depends) {
                Array.prototype.push.apply(depends, conf.depends);
            }
            return depends;
        };
        this.getDependOn = function (featType) {
            var dependOns = [];
            var _isDependOn = function (conf) {
                if (conf.depends && conf.depends.indexOf(featType) >= 0) {
                    return true;
                }
                return false;
            };
            var k,
                kk;
            for (k in config) {
                if (config.hasOwnProperty(k) && k !== featType) {
                    if (_isDependOn(config[k])) {
                        dependOns.push(k);
                    }
                }
            }
            return dependOns;
        };
        this.isNode = function (featType) {
            return !(linkNodeConf[featType] === undefined);
        };
        this.getLinkByNode = function (geoLiveType) {
            return linkNodeConf[geoLiveType];
        };
        this.getNodeByLink = function (geoLiveType) {
            var nodeType = null;
            var keys = Object.getOwnPropertyNames(linkNodeConf);
            for (var i = 0; i < keys.length; i++) {
                if (linkNodeConf[keys[i]] === geoLiveType) {
                    nodeType = keys[i];
                    break;
                }
            }
            return nodeType;
        };
        this.getMapping = function () {
            var ret = {};
            for (var k in config) {
                if (config.hasOwnProperty(k)) {
                    ret[k] = config[k].name;
                }
            }
            return ret;
        };
        this.getServerFeatureType = function (featType) {
            var conf = this.getConfig(featType);
            if (!conf) {
                return null;
            }
            if (!conf.serverFeatureType) {
                return null;
            }
            return conf.serverFeatureType;
        };
        this.getUIFeatureTypes = function (serverFeatureType) {
            var ret = [];
            for (var k in config) {
                if (config.hasOwnProperty(k) && config[k].serverFeatureType == serverFeatureType) {
                    ret.push(k);
                }
            }
            return ret;
        };
    };

    return function () {
        if (!instance) {
            instance = new Singleton();
        }
        return instance;
    };
}());
