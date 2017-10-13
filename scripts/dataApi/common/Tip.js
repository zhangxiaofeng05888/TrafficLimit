/**
 * Created by zhaohang on 2017/4/9.
 */

FM.dataApi.Tip = FM.dataApi.GeoDataModel.extend({
    /**
     * @geoLiveType
     * 模型类型
     */
    geoLiveType: 'TIP',

    /**
     * 对象初始化
     */
    initialize: function (data) {
        if (data.rowkey) {
            this.pid = data.rowkey || null;
            this.rowkey = data.rowkey || null;
        } else {
            this.rowkey = null;
            this.pid = null;
        }
        if (data.source) {
            this.source = {
                s_featureKind: data.source.s_featureKind || 2,
                s_project: data.source.s_project || '',
                s_sourceCode: data.source.s_sourceCode || 7,
                s_sourceId: data.source.s_sourceId || '',
                s_sourceType: data.source.s_sourceType || '',
                s_sourceProvider: data.source.s_sourceProvider || 0,
                s_reliability: data.source.s_reliability || 0,
                s_qTaskId: data.source.s_qTaskId || 0,
                s_mTaskId: data.source.s_mTaskId || 0,
                s_qSubTaskId: data.source.s_qSubTaskId || 0,
                s_mSubTaskId: data.source.s_mSubTaskId || 0
            };
            if (App.Temp.programType == '1') {
                this.source.s_mTaskId = App.Temp.taskId;
                this.source.s_mSubTaskId = App.Temp.subTaskId;
                this.source.s_qTaskId = 0;
                this.source.s_qSubTaskId = 0;
            }
            if (App.Temp.programType == '4') {
                this.source.s_qTaskId = App.Temp.taskId;
                this.source.s_qSubTaskId = App.Temp.subTaskId;
                this.source.s_mTaskId = 0;
                this.source.s_mSubTaskId = 0;
            }
        } else {
            this.source = {
                s_featureKind: 2,
                s_project: '',
                s_sourceCode: 7,
                s_sourceId: '',
                s_sourceType: '',
                s_sourceProvider: 0,
                s_reliability: 0,
                s_qTaskId: 0,
                s_mTaskId: 0,
                s_qSubTaskId: 0,
                s_mSubTaskId: 0
            };
            if (App.Temp.programType == '1') {
                this.source.s_mTaskId = App.Temp.taskId;
                this.source.s_mSubTaskId = App.Temp.subTaskId;
                this.source.s_qTaskId = 0;
                this.source.s_qSubTaskId = 0;
            }
            if (App.Temp.programType == '4') {
                this.source.s_qTaskId = App.Temp.taskId;
                this.source.s_qSubTaskId = App.Temp.subTaskId;
                this.source.s_mTaskId = 0;
                this.source.s_mSubTaskId = 0;
            }
        }
        if (data.geometry) {
            this.geometry = {
                g_location: data.geometry.g_location || {},
                g_guide: data.geometry.g_guide || {}
            };
        } else {
            this.geometry = {
                g_location: {},
                g_guide: {}
            };
        }
        if (data.track) {
            this.track = {

                t_lifecycle: data.track.t_lifecycle || (data.track.t_lifecycle === 0 ? 0 : 3),
                t_command: data.track.t_command || 0,
                t_date: data.track.t_date || '',
                t_tipStatus: data.track.t_tipStatus || (data.track.t_tipStatus === 0 ? 0 : 1),
                t_dEditStatus: data.track.t_dEditStatus || 0,
                t_dEditMeth: data.track.t_dEditMeth || 0,
                t_mEditStatus: data.track.t_mEditStatus || 0,
                t_mEditMeth: data.track.t_mEditMeth || 0,
                t_trackInfo: []
            };
            if (data.track.t_trackInfo && data.track.t_trackInfo.length > 0) {
                this.track.t_trackInfo = this.deepCopy(data.track.t_trackInfo);
            }
        } else {
            this.track = {
                t_lifecycle: 3,
                t_command: 0,
                t_date: '',
                t_tipStatus: 1,
                t_dEditStatus: 0,
                t_dEditMeth: 0,
                t_mEditStatus: 0,
                t_mEditMeth: 0,
                t_trackInfo: []
            };
        }
        if (data.feedback && data.feedback.f_array && data.feedback.f_array.length > 0) {
            this.feedback = data.feedback;
        } else {
            this.feedback = {
                f_array: []
            };
        }
        if (data.content) {
            this.content = data.content || '';
        } else {
            this.content = '';
        }
        FM.dataApi.GeoDataModel.prototype.initialize.apply(this, arguments);
    },

    setAttributes: function (data) {
        FM.extend(this, data);
    },

    /*
     * 深拷贝
     */
    deepCopy: function (o) {
        if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        } else if (o instanceof Object) {
            var b = {};
            for (var j in o) {
                if ({}.hasOwnProperty.call(o, j)) {
                    b[j] = this.deepCopy(o[j]);
                }
            }
            return b;
        }
        return o;
    },
    statics: {
        create: function (item) {
            var ret = null;
            switch (item.source.s_sourceType) {
                case '1107': // 收费站
                    ret = new fastmap.dataApi.TipTollGate(item);
                    break;
                case '1201': // 道路种别
                    ret = new fastmap.dataApi.TipRoadType(item);
                    break;
                case '1202': // 车道数
                    ret = new fastmap.dataApi.TipDrivewayMount(item);
                    break;
                case '1101': // 点限速
                    ret = new fastmap.dataApi.TipRestriction(item);
                    break;
                case '1102': // 红绿灯
                    ret = new fastmap.dataApi.TipTrafficSignal(item);
                    break;
                case '1205': // SA(服务区)
                    ret = new fastmap.dataApi.TipRoadSA(item);
                    break;
                case '1206': // PA（停车区）
                    ret = new fastmap.dataApi.TipRoadPA(item);
                    break;
                case '1207': // 匝道
                    ret = new fastmap.dataApi.TipRamp(item);
                    break;
                case '1203': // 道路方向
                    ret = new fastmap.dataApi.TipRoadDirection(item);
                    break;
                case '1702': // 铁路道口
                    ret = new fastmap.dataApi.TipRailwayCrossing(item);
                    break;
                case '1501': // 上下线分离
                    ret = new fastmap.dataApi.TipMultiDigitized(item);
                    break;
                case '1507': // 步行街
                    ret = new fastmap.dataApi.TipPedestrianStreet(item);
                    break;
                case '1508': // 公交专用车道
                    ret = new fastmap.dataApi.TipBusLane(item);
                    break;
                case '1510': // 桥
                    ret = new fastmap.dataApi.TipBridge(item);
                    break;
                case '1511': // 隧道
                    ret = new fastmap.dataApi.TipTunnel(item);
                    break;
                case '1514': // 施工
                    ret = new fastmap.dataApi.TipMaintenance(item);
                    break;
                case '1901': // 道路名
                    ret = new fastmap.dataApi.TipRoadName(item);
                    break;
                case '2001': // 测线
                    ret = new fastmap.dataApi.TipLinks(item);
                    break;
                case '2101': // 删除标记
                    ret = new fastmap.dataApi.TipDeleteTag(item);
                    break;
                case '1601': // 环岛
                    ret = new fastmap.dataApi.TipRoundabout(item);
                    break;
                case '1803': // 挂接
                    ret = new fastmap.dataApi.TipConnect(item);
                    break;
                case '1301': // 车信
                    ret = new fastmap.dataApi.TipLaneConnexity(item);
                    break;
                case '8001': // FC
                    ret = new fastmap.dataApi.PreTipFC(item);
                    break;
                case '8002': // 接边
                    ret = new fastmap.dataApi.TipBorder(item);
                    break;
                case '1604': // 区域内道路
                    ret = new fastmap.dataApi.TipRegionRoad(item);
                    break;
                case '1208': // 停车场出入口Link
                    ret = new fastmap.dataApi.TipParkinglot(item);
                    break;
                case '1209': // 航线
                    ret = new fastmap.dataApi.TipRoute(item);
                    break;
                case '1304': // 禁止穿行 *
                    ret = new fastmap.dataApi.TipNoCrossing(item);
                    break;
                case '1305': // 禁止驶入 *
                    ret = new fastmap.dataApi.TipNoEntry(item);
                    break;
                case '1701': // 障碍物
                    ret = new fastmap.dataApi.TipObstacle(item);
                    break;
                case '1703': // 分叉路口提示
                    ret = new fastmap.dataApi.TipRoadCrossProm(item);
                    break;
                case '1704': // 交叉路口
                    ret = new fastmap.dataApi.TipRoadCross(item);
                    break;
                case '1705': // 立交桥名称
                    ret = new fastmap.dataApi.TipOverpassName(item);
                    break;
                case '1706': // GPS打点
                    ret = new fastmap.dataApi.TipGPSDot(item);
                    break;
                case '1502': // 路面覆盖 *
                    ret = new fastmap.dataApi.TipPavementCover(item);
                    break;
                case '1503': // 高架路
                    ret = new fastmap.dataApi.TipElevatedRoad(item);
                    break;
                case '1504': // overpass
                    ret = new fastmap.dataApi.TipOverpass(item);
                    break;
                case '1505': // underpass
                    ret = new fastmap.dataApi.TipUnderpass(item);
                    break;
                case '1506': // 私道
                    ret = new fastmap.dataApi.TipBypath(item);
                    break;
                case '1509': // 跨线立交桥
                    ret = new fastmap.dataApi.TipCrossLineOverpass(item);
                    break;
                case '1512': // 辅路
                    ret = new fastmap.dataApi.TipSideRoad(item);
                    break;
                case '1513': // 窄道
                    ret = new fastmap.dataApi.TipNarrowChannel(item);
                    break;
                case '1515': // 维修
                    ret = new fastmap.dataApi.TipRepair(item);
                    break;
                case '1516': // 季节性关闭道路
                    ret = new fastmap.dataApi.TipSeasonalRoad(item);
                    break;
                case '1517': // usage fee
                    ret = new fastmap.dataApi.TipUsageFeeRequired(item);
                    break;
                case '1103': // 红绿灯方位 *
                    ret = new fastmap.dataApi.TipTrafficSignalDir(item);
                    break;
                case '1104': // 大门 *
                    ret = new fastmap.dataApi.TipGate(item);
                    break;
                case '1105': // 危险信息
                    ret = new fastmap.dataApi.TipWarningInfo(item);
                    break;
                case '1106': // 坡度 *
                    ret = new fastmap.dataApi.TipSlope(item);
                    break;
                case '1109': // 电子眼
                    ret = new fastmap.dataApi.TipElectroniceye(item);
                    break;
                case '1111': // 条件限速 *
                    ret = new fastmap.dataApi.TipSpeedlimit(item);
                    break;
                case '1403': // 3d分歧
                    ret = new fastmap.dataApi.Tip3DBranch(item);
                    break;
                case '1404': // 提左提右 *
                    ret = new fastmap.dataApi.TipLeftToRight(item);
                    break;
                case '1405': // 一般道路方面
                    ret = new fastmap.dataApi.TipNormalRoadSide(item);
                    break;
                case '1407': // 高速分歧
                    ret = new fastmap.dataApi.TipGSBranch(item);
                    break;
                case '1410': // 高速入口模式图
                    ret = new fastmap.dataApi.TipHighSpeedEntrance(item);
                    break;
                case '1602': // 特殊交通类型
                    ret = new fastmap.dataApi.TipSpecialTrafficType(item);
                    break;
                case '1605': // POI连接路
                    ret = new fastmap.dataApi.TipPOIRoad(item);
                    break;
                case '1606': // 收费开放道路
                    ret = new fastmap.dataApi.TipChargeOpenRoad(item);
                    break;
                case '1607': // 风景路线
                    ret = new fastmap.dataApi.TipScenicRoute(item);
                    break;
                case '1804': // 顺行
                    ret = new fastmap.dataApi.TipDirect(item);
                    break;
                case '1302': // 普通交限
                    ret = new fastmap.dataApi.TipNomalRestriction(item);
                    break;
                case '1806': // 草图
                    ret = new fastmap.dataApi.TipSketch(item);
                    break;
                //  315不上线
                case '1108': // 减速带
                    ret = new fastmap.dataApi.TipSpeedBump(item);
                    break;
                case '1110': // 卡车限制
                    ret = new fastmap.dataApi.TipTruckLimit(item);
                    break;
                case '1112': // 可变限速
                    ret = new fastmap.dataApi.TipVariableSpeed(item);
                    break;
                case '1113': // 车道限速
                    ret = new fastmap.dataApi.TipDrivewayLimit(item);
                    break;
                case '1114': // 卡车限速
                    ret = new fastmap.dataApi.TipTruckSpeedLimit(item);
                    break;
                case '1115': // 车道变化点
                    ret = new fastmap.dataApi.TipLaneChangePoint(item);
                    break;
                case '1204': // 可逆车道
                    ret = new fastmap.dataApi.TipReversibleLane(item);
                    break;
                case '1303': // 卡车交限
                    ret = new fastmap.dataApi.TipTruckRestriction(item);
                    break;
                case '1306': // 路口语音引导
                    ret = new fastmap.dataApi.TipCrossVoiceGuide(item);
                    break;
                case '1307': // 自然语音引导
                    ret = new fastmap.dataApi.TipNatureVoiceGuide(item);
                    break;
                case '1308': // 禁止卡车驶入
                    ret = new fastmap.dataApi.TipBanTrucksIn(item);
                    break;
                case '1310': // 公交车道
                    ret = new fastmap.dataApi.TipBusDriveway(item);
                    break;
                case '1311': // 可变导向车道
                    ret = new fastmap.dataApi.TipVariableDirectionLane(item);
                    break;
                case '1401': // 方向看板
                    ret = new fastmap.dataApi.TipOrientation(item);
                    break;
                case '1402': // Real sign
                    ret = new fastmap.dataApi.TipRealSign(item);
                    break;
                case '1406': // 实景图
                    ret = new fastmap.dataApi.TipJVCBranch(item);
                    break;
                case '1409': // 普通路口模式图
                    ret = new fastmap.dataApi.TipNormalCross(item);
                    break;
                case '1707': // 里程桩
                    ret = new fastmap.dataApi.TipMileagePeg(item);
                    break;
                //  新增
                case '2002': // ADAS测线
                    ret = new fastmap.dataApi.TipADASLink(item);
                    break;
                case '1708': // ADAS打点
                    ret = new fastmap.dataApi.TipADASNode(item);
                    break;
                case '1709': // 点位移
                    ret = new fastmap.dataApi.TipNodeShift(item);
                    break;
                case '1518': // 阶梯
                    ret = new fastmap.dataApi.TipStair(item);
                    break;
                case '2201': // 地下通道/过街天桥
                    ret = new fastmap.dataApi.TipOverBridge(item);
                    break;
                case '2102': // 万能标记
                    ret = new fastmap.dataApi.TipGeneral(item);
                    break;
                case '1116': // 立交
                    ret = new fastmap.dataApi.TipGSC(item);
                    break;
                case '1211': // 高速连接路
                    ret = new fastmap.dataApi.TipHighWayConnect(item);
                    break;
                case '1117': // 车道限宽限高
                    ret = new fastmap.dataApi.TipLaneLimitWidthHeight(item);
                    break;
                case '1214': // 删除在建属性
                    ret = new fastmap.dataApi.TipDeletePropertyInProgress(item);
                    break;
                case '1520': // 在建时间变更
                    ret = new fastmap.dataApi.TipBuildTimeChange(item);
                    break;
                //  未制作
                case '8005': // 机场功能面
                    ret = new fastmap.dataApi.TipAirPortFace(item);
                    break;
                case '8006': // Highway道路名
                    ret = new fastmap.dataApi.TipHighway(item);
                    break;
                case '8007': // AOI面
                    ret = new fastmap.dataApi.TipAOIFace(item);
                    break;
                case '8008': // AOI代表点
                    ret = new fastmap.dataApi.TipAOINode(item);
                    break;
                case '8009': // 地铁
                    ret = new fastmap.dataApi.TipRailWay(item);
                    break;
                case '8010': // BUA
                    ret = new fastmap.dataApi.TipBUAFace(item);
                    break;
                default:
                    break;
            }
            return ret;
        }
    }
});
