/**
 * Created by zhongxiaoming on 2017/4/9.
 */
FM.uikit.Config = FM.uikit.Config || {};

// 单例，只读 情报适量化tips工具
FM.uikit.Config.PretreatmentTip = (function () {
    var instance;

    var Singleton = function () {
        var config = {
            TIPFC: {
                name: 'fc',
                serverFeatureType: '',
                model: fastmap.dataApi.PreTipFC,
                depends: ['RDLINK'],
                template: { // 要素的页面片段
                    edit: { // 属性编辑片段
                        ctrl: 'components/pretreatment/ctrls/attr_fc_ctrl/fcAttrCtrl.js',
                        tmpl: 'components/pretreatment/tpls/attr_fc_tpl/fcAttrTpl.html'
                    }
                },
                editTools: ['ADDFC', 'MODIFYFC', 'BREAKFC'] // 地图操作工具列表
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
