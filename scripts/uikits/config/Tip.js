FM.uikit.Config = FM.uikit.Config || {};

// 单例，只读
FM.uikit.Config.Tip = (function () {
    var instance;

    var Singleton = function () {
        var template = { // 属性显示片段
            ctrl: 'components/road/ctrls/attr_tips_ctrl/sceneAllTipsCtrl.js',
            tmpl: 'components/road/tpls/attr_tips_tpl/sceneAllTipsTpl.html'
        };
        var config = {
            TIPRESTRICTION: {
                code: '1101',
                name: '点限速',
                relateFeature: 'RDLINK'
            },
            TIPTRAFFICSIGNAL: {
                code: '1102',
                name: '红绿灯',
                relateFeature: 'RDLINK'
            },
            TIPTRAFFICSIGNALDIR: {
                code: '1103',
                name: '红绿灯方位',
                relateFeature: 'RDLINK'
            },
            TIPGATE: {
                code: '1104',
                name: '大门',
                relateFeature: 'RDLINK'
            },
            TIPWARNINGINFO: {
                code: '1105',
                name: '警示信息',
                relateFeature: 'RDLINK'
            },
            TIPSLOPE: {
                code: '1106',
                name: '坡度',
                relateFeature: 'RDLINK'
            },
            TIPTOLLGATE: {
                code: '1107',
                name: '收费站',
                relateFeature: 'RDLINK'
            },
            TIPSPEEDBUMP: {
                code: '1108',
                name: '减速带',
                relateFeature: 'RDLINK'
            },
            TIPELECTRONICEYE: {
                code: '1109',
                name: '电子眼',
                relateFeature: 'RDLINK'
            },
            TIPTRUCKLIMIT: {
                code: '1110',
                name: '卡车限制',
                relateFeature: 'RDLINK'
            },
            TIPSPEEDLIMIT: {
                code: '1111',
                name: '条件限速',
                relateFeature: 'RDLINK'
            },
            TIPVARIABLESPEED: {
                code: '1112',
                name: '可变限速',
                relateFeature: 'RDLINK'
            },
            TIPDRIVEWAYLIMIT: {
                code: '1113',
                name: '车道限速',
                relateFeature: 'RDLINK'
            },
            TIPROADTYPE: {
                code: '1201',
                name: '道路种别',
                relateFeature: 'RDLINK'
            },
            TIPDRIVEWAYMOUNT: {
                code: '1202',
                name: '车道数',
                relateFeature: 'RDLINK'
            },
            TIPROADDIRECTION: {
                code: '1203',
                name: '道路方向',
                relateFeature: 'RDLINK'
            },
            TIPREVERSIBLELANE: {
                code: '1204',
                name: '可逆车道',
                relateFeature: 'RDLINK'
            },
            TIPROADSA: {
                code: '1205',
                name: 'SA(服务区)',
                relateFeature: 'RDLINK'
            },
            TIPROADPA: {
                code: '1206',
                name: 'PA(停车区)',
                relateFeature: 'RDLINK'
            },
            TIPRAMP: {
                code: '1207',
                name: '匝道',
                relateFeature: 'RDLINK'
            },
            TIPPARKINGLOT: {
                code: '1208',
                name: '停车场出入口Link',
                relateFeature: 'RDLINK'
            },
            TIPROUTE: {
                code: '1209',
                name: '航线',
                relateFeature: 'RDLINK'
            },
            1210: {
                code: '1210',
                name: 'ADAS',
                relateFeature: 'RDLINK'
            },
            TIPLANECONNEXITY: {
                code: '1301',
                name: '车信',
                relateFeature: 'RDLINK'
            },
            TIPNOMALRESTRICTION: {
                code: '1302',
                name: '交限',
                relateFeature: 'RDLINK'
            },
            TIPTRUCKRESTRICTION: {
                code: '1303',
                name: '卡车交限',
                relateFeature: 'RDLINK'
            },
            TIPNOCROSSING: {
                code: '1304',
                name: '禁止穿行',
                relateFeature: 'RDLINK'
            },
            TIPNOENTRY: {
                code: '1305',
                name: '禁止驶入',
                relateFeature: 'RDLINK'
            },
            TIPCROSSVOICEGUIDE: {
                code: '1306',
                name: '路口语音引导',
                relateFeature: 'RDLINK'
            },
            TIPNATUREVOICEGUIDE: {
                code: '1307',
                name: '自然语音引导',
                relateFeature: 'RDLINK'
            },
            TIPBANTRUCKSIN: {
                code: '1308',
                name: '禁止卡车驶入',
                relateFeature: 'RDLINK'
            },

            1309: {
                code: '1309',
                name: 'CLM',
                relateFeature: 'RDLINK'
            },
            TIPBUSDRIVEWAY: {
                code: '1310',
                name: '公交车道',
                relateFeature: 'RDLINK'
            },
            TIPVARIABLEDIRECTIONLANE: {
                code: '1311',
                name: '可变导向车道',
                relateFeature: 'RDLINK'
            },
            TIPORIENTATION: {
                code: '1401',
                name: '方向看板',
                relateFeature: 'RDLINK'
            },
            TIPREALSIGN: {
                code: '1402',
                name: 'Real Sign',
                relateFeature: 'RDLINK'
            },
            TIP3DBRANCH: {
                code: '1403',
                name: '3D分歧',
                relateFeature: 'RDLINK'
            },
            TIPLEFTTORIGHT: {
                code: '1404',
                name: '提左提右',
                relateFeature: 'RDLINK'
            },
            TIPNORMALROADSIDE: {
                code: '1405',
                name: '一般道路方面',
                relateFeature: 'RDLINK'
            },
            TIPJVCBRANCH: {
                code: '1406',
                name: '实景图',
                relateFeature: 'RDLINK'
            },
            TIPGSBRANCH: {
                code: '1407',
                name: '高速分歧',
                relateFeature: 'RDLINK'
            },
            1408: {
                code: '1408',
                name: '高速路口实景图',
                relateFeature: 'RDLINK'
            },
            TIPNORMALCROSS: {
                code: '1409',
                name: '普通路口模式图',
                relateFeature: 'RDLINK'
            },
            TIPHIGHSPEEDENTRANCE: {
                code: '1410',
                name: '高速入口模式图',
                relateFeature: 'RDLINK'
            },
            TIPMULTIDIGITIZED: {
                code: '1501',
                name: '上下线分离',
                relateFeature: 'RDLINK'
            },
            TIPPAVEMENTCOVER: {
                code: '1502',
                name: '路面无覆盖',
                relateFeature: 'RDLINK'
            },
            TIPELEVATEDROAD: {
                code: '1503',
                name: '高架路',
                relateFeature: 'RDLINK'
            },
            TIPOVERPASS: {
                code: '1504',
                name: 'OverPass(跨线天桥)',
                relateFeature: 'RDLINK'
            },
            TIPUNDERPASS: {
                code: '1505',
                name: 'UnderPass(跨线地道)',
                relateFeature: 'RDLINK'
            },
            TIPBYPATH: {
                code: '1506',
                name: '私道',
                relateFeature: 'RDLINK'
            },
            TIPPEDESTRIANSTREET: {
                code: '1507',
                name: '步行街',
                relateFeature: 'RDLINK'
            },
            TIPBUSLANE: {
                code: '1508',
                name: '公交专用道路',
                relateFeature: 'RDLINK'
            },
            TIPCROSSLINEOVERPASS: {
                code: '1509',
                name: '跨线立交桥',
                relateFeature: 'RDLINK'
            },
            TIPBRIDGE: {
                code: '1510',
                name: '桥',
                relateFeature: 'RDLINK'
            },
            TIPTUNNEL: {
                code: '1511',
                name: '隧道',
                relateFeature: 'RDLINK'
            },
            TIPSIDEROAD: {
                code: '1512',
                name: '辅路',
                relateFeature: 'RDLINK'
            },
            TIPNARROWCHANNEL: {
                code: '1513',
                name: '窄道',
                relateFeature: 'RDLINK'
            },
            TIPMAINTENANCE: {
                code: '1514',
                name: '施工',
                relateFeature: 'RDLINK'
            },
            TIPREPAIR: {
                code: '1515',
                name: '维修',
                relateFeature: 'RDLINK'
            },
            TIPSEASONALROAD: {
                code: '1516',
                name: '季节性关闭道路',
                relateFeature: 'RDLINK'
            },
            TIPUSAGEFEEREQUIRED: {
                code: '1517',
                name: 'Usage Fee Required',
                relateFeature: 'RDLINK'
            },
            TipStair: {
                code: '1518',
                name: '阶梯',
                relateFeature: 'RDLINK'
            },
            1519: {
                code: '1519',
                name: '休闲路线',
                relateFeature: 'RDLINK'
            },
            TIPROUNDABOUT: {
                code: '1601',
                name: '环岛',
                relateFeature: 'RDLINK'
            },
            TIPSPECIALTRAFFICTYPE: {
                code: '1602',
                name: '特殊交通类型',
                relateFeature: 'RDLINK'
            },
            1603: {
                code: '1603',
                name: '未定义交通类型',
                relateFeature: 'RDLINK'
            },
            TIPREGIONROAD: {
                code: '1604',
                name: '区域内道路',
                relateFeature: 'RDLINK'
            },
            TIPPOIROAD: {
                code: '1605',
                name: 'POI连接路',
                relateFeature: 'RDLINK'
            },
            TIPCHARGEOPENROAD: {
                code: '1606',
                name: '收费开放道路',
                relateFeature: 'RDLINK'
            },
            TIPSCENICROUTE: {
                code: '1607',
                name: '风景路线',
                relateFeature: 'RDLINK'
            },
            TIPOBSTACLE: {
                code: '1701',
                name: '障碍物',
                relateFeature: 'RDLINK'
            },
            TIPRAILWAYCROSSING: {
                code: '1702',
                name: '铁路道口',
                relateFeature: 'RDLINK'
            },
            TIPROADCROSSPROM: {
                code: '1703',
                name: '分叉口提示(SE)',
                relateFeature: 'RDLINK'
            },
            TIPROADCROSS: {
                code: '1704',
                name: '交叉路口名称',
                relateFeature: 'RDLINK'
            },
            TIPOVERPASSNAME: {
                code: '1705',
                name: '立交桥名称',
                relateFeature: 'RDLINK'
            },
            TIPGPSDOT: {
                code: '1706',
                name: 'GPS打点',
                relateFeature: 'RDLINK'
            },
            TIPMILEAGEPEG: {
                code: '1707',
                name: '里程桩',
                relateFeature: 'RDLINK'
            },
            TIPGSC: {
                code: '1116',
                name: '立交',
                relateFeature: 'RDLINK'
            },
            1801: {
                code: '1801',
                name: '立交',
                relateFeature: 'RDLINK'
            },
            1802: {
                code: '1802',
                name: '背景',
                relateFeature: 'RDLINK'
            },
            TIPCONNECT: {
                code: '1803',
                name: '挂接',
                relateFeature: 'RDLINK'
            },
            TIPDIRECT: {
                code: '1804',
                name: '顺行',
                relateFeature: 'RDLINK'
            },
            1805: {
                code: '1805',
                name: '复合路口',
                relateFeature: 'RDLINK'
            },
            TIPSKETCH: {
                code: '1806',
                name: '草图',
                relateFeature: 'RDLINK'
            },
            TIPBORDER: {
                code: '8002',
                name: '接边标识',
                relateFeature: 'RDLINK',
                template: { // 要素的页面片段
                    edit: {
                        ctrl: 'components/road/ctrls/attr_BorderTips_ctrl/editBorderTipsCtrl.js',
                        tmpl: 'components/road/tpls/attr_BorderTips_tpl/editBorderTipsTpl.html'
                    },
                    add: {
                        ctrl: 'components/road/ctrls/attr_BorderTips_ctrl/addBorderTipsCtrl.js',
                        tmpl: 'components/road/tpls/attr_BorderTips_tpl/addBorderTipsTpl.html'
                    }
                }
            },
            TIPROADNAME: {
                code: '1901',
                name: '道路名',
                relateFeature: 'RDLINK'
            },
            TIPLINKS: {
                code: '2001',
                name: '测线',
                relateFeature: 'RDLINK'
            },
            TIPDELETETAG: {
                code: '2101',
                name: '形状删除',
                relateFeature: 'RDLINK'
            },
            TIPFC: {
                code: '8001',
                name: 'FC预处理',
                relateFeature: 'RDLINK'
            },
            TIPGENERAL: {
                code: '2102',
                name: '万能标记',
                relateFeature: 'RDLINK'
            },
            TIPOVERBRIDGE: {
                code: '2201',
                name: '地下通道／过街天桥',
                relateFeature: 'RDLINK'
            },
            2202: {
                code: '2202',
                name: '人行过道',
                relateFeature: 'RDLINK'
            },
            2203: {
                code: '2203',
                name: '单线虚拟连接',
                relateFeature: 'RDLINK'
            },
            2204: {
                code: '2204',
                name: '复合虚拟连接',
                relateFeature: 'RDLINK'
            },
            TIPADASLINK: {
                code: '2002',
                name: 'ADAS测线',
                relateFeature: 'RDLINK'
            },
            TIPADASNODE: {
                code: '1708',
                name: 'ADAS打点',
                relateFeature: 'RDLINK'
            },
            TIPNODESHIFT: {
                code: '1709',
                name: '点位移',
                relateFeature: 'RDLINK'
            },
            TIPSTAIR: {
                code: '1518',
                name: '阶梯',
                relateFeature: 'RDLINK'
            },
            TIPLANECHANGEPOINT: {
                code: '1115',
                name: '车道变化点',
                relateFeature: 'RDLINK'
            },
            TIPTRUCKSPEEDLIMIT: {
                code: '1114',
                name: '卡车限速',
                relateFeature: 'RDLINK'
            },
            TIPHIGHWAYCONNECT: {
                code: '1211',
                name: '高速连接路',
                relateFeature: 'RDLINK'
            },
            TIPLANELIMITWIDTHHEIGHT: {
                code: '1117',
                name: '车道限宽限高',
                relateFeature: 'RDLINK'
            },
            TIPDELETEPROPERTYINPROGRESS: {
                code: '1214',
                name: '删除在建属性',
                relateFeature: 'RDLINK'
            },
            TIPBUILDTIMECHANGE: {
                code: '1520',
                name: '在建时间变更',
                relateFeature: 'RDLINK'
            },
            8005: {
                code: '8005',
                name: '预处理机场功能面',
                relateFeature: 'RDLINK'
            },
            8006: {
                code: '8006',
                name: '预处理Highway道路名',
                relateFeature: 'RDLINK'
            },
            8007: {
                code: '8007',
                name: '预处理AOI面',
                relateFeature: 'RDLINK'
            },
            8008: {
                code: '8008',
                name: '预处理AOI代表点',
                relateFeature: 'RDLINK'
            },
            8009: {
                code: '8009',
                name: '预处理地铁',
                relateFeature: 'RDLINK'
            },
            8010: {
                code: '8005',
                name: '预处理BUA',
                relateFeature: 'RDLINK'
            }
        };
        this.getConfig = function (tipType) {
            var conf = config[tipType];
            if (!conf) {
                return null;
            }
            return conf;
        };
        this.getName = function (tipType) {
            var conf = this.getConfig(tipType);
            if (!conf) {
                return null;
            }
            if (!conf.name) {
                return null;
            }
            return conf.name;
        };
        this.getNameByCode = function (tipCode) {
            var name = null;
            for (var k in config) {
                if (config.hasOwnProperty(k)) {
                    if (config[k].code === tipCode) {
                        name = config[k].name;
                        break;
                    }
                }
            }
            return name;
        };
        this.getGLTByCode = function (tipCode) {
            var key = null;
            for (var k in config) {
                if (config.hasOwnProperty(k)) {
                    if (config[k].code === tipCode) {
                        key = k;
                        break;
                    }
                }
            }
            return key;
        };
        this.getAddTemplate = function (tipType) {
            var conf = this.getConfig(tipType);
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
        this.getEditTemplate = function (tipType) {
            var conf = this.getConfig(tipType);
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
        this.getViewTemplate = function () {
            return template;
        };
        this.getRelateFeature = function (tipType) {
            var conf = this.getConfig(tipType);
            if (!conf) {
                return null;
            }
            if (!conf.relateFeature) {
                return null;
            }
            return conf.relateFeature;
        };
        this.getDataModel = function (tipType) {
            var conf = this.getConfig(tipType);
            if (!conf) {
                return null;
            }
            if (!conf.code) {
                return null;
            }
            return conf.code;
        };
        this.getDepends = function (tipType) {
            return [];
        };
        this.getDependOn = function (tipType) {
            return ['TIPBORDER'];
        };
        this.getMapping = function () {
            var ret = {};
            for (var k in config) {
                if (config.hasOwnProperty(k)) {
                    ret[config[k].code] = config[k].name;
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
