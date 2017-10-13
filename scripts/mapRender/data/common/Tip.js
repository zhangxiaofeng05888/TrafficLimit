/**
 * Tips要素渲染数据模型的基类
 * @class FM.mapApi.render.data.Tip
 * @author ChenXiao
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Tip = FM.mapApi.render.data.DataModel.extend({
    redFill: {
        lineColor: 'red',
        fillColor: 'rgba(225,225,225,0.5)'
    },
    blueFill: {
        lineColor: 'blue',
        fillColor: 'rgba(225,225,225,0.5)'
    },

    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ChenXiao
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    initialize: function (data) {
        this.type = 'tips';
        this.geometry = null;
        this.properties = null;

        if (data) {
            this.geometry = {};
            this.geometry.type = 'Point';
            this.geometry.coordinates = data.g;

            this.properties = {};
            this.properties.id = data.i;
            this.properties.code = data.t;
            this.properties.status = parseInt(data.m.a || 0, 10);   //  兼容预处理平台tips，当不返回m.a时，状态默认为0
            this.properties.dbId = data.d;
        }

        this.setAttribute.apply(this, arguments);
    },

    statics: {
        /**
         * 要素渲染数据模型路由函数，在这里匹配对应的构造方法
         * @method create
         * @author ChenXiao
         * @date   2017-09-12
         * @param  {object} item 接口返回的数据
         * @return {object}  要素渲染数据模型
         */
        create: function (item) {
            var ret = null;
            switch (item.t) {
                case '1101': // 限速
                    ret = new FM.mapApi.render.data.TipRestriction(item);
                    break;
                case '1102': // 红绿灯 *
                    ret = new FM.mapApi.render.data.TipTrafficSignal(item);
                    break;
                case '1103': // 红绿灯方位 *
                    ret = new FM.mapApi.render.data.TipTrafficSignalDir(item);
                    break;
                case '1104': // 大门 *
                    ret = new FM.mapApi.render.data.TipGate(item);
                    break;
                case '1105':// 危险信息
                    ret = new FM.mapApi.render.data.TipWarningInfo(item);
                    break;
                case '1106': // 坡度 *
                    ret = new FM.mapApi.render.data.TipSlope(item);
                    break;
                case '1107': // 收费站
                    ret = new FM.mapApi.render.data.TipTollGate(item);
                    break;
                case '1109': // 电子眼
                    ret = new FM.mapApi.render.data.TipElectroniceye(item);
                    break;
                case '1111': // 条件限速 *
                    ret = new FM.mapApi.render.data.TipSpeedlimit(item);
                    break;
                case '1201': // 道路种别
                    ret = new FM.mapApi.render.data.TipRoadType(item);
                    break;
                case '1202': // 车道数 *
                    ret = new FM.mapApi.render.data.TipDrivewayMount(item);
                    break;
                case '1203': // 道路方向
                    ret = new FM.mapApi.render.data.TipRoadDirection(item);
                    break;
                case '1205': // SA
                    ret = new FM.mapApi.render.data.TipRoadSA(item);
                    break;
                case '1206': // PA
                    ret = new FM.mapApi.render.data.TipRoadPA(item);
                    break;
                case '1207': // 匝道 *
                    ret = new FM.mapApi.render.data.TipRamp(item);
                    break;
                case '1208': // 停车场出入口 *
                    ret = new FM.mapApi.render.data.TipParkinglot(item);
                    break;
                case '1209': // 航线
                    ret = new FM.mapApi.render.data.TipRoute(item);
                    break;
                case '1301': // 车信
                    ret = new FM.mapApi.render.data.TipLaneConnexity(item);
                    break;
                case '1302': // 普通交限
                    ret = new FM.mapApi.render.data.TipNomalRestriction(item);
                    break;
                case '1304': // 禁止穿行 *
                    ret = new FM.mapApi.render.data.TipNoCrossing(item);
                    break;
                case '1305': // 禁止驶入 *
                    ret = new FM.mapApi.render.data.TipNoEntry(item);
                    break;
                case '1403': // 3d分歧
                    ret = new FM.mapApi.render.data.Tip3DBranch(item);
                    break;
                case '1404': // 提左提右 *
                    ret = new FM.mapApi.render.data.TipLeftToRight(item);
                    break;
                case '1405': // 一般道路方面
                    ret = new FM.mapApi.render.data.TipNormalRoadSide(item);
                    break;
                case '1407': // 高速分歧
                    ret = new FM.mapApi.render.data.TipGSBranch(item);
                    break;
                case '1410': // 高速入口模式图
                    ret = new FM.mapApi.render.data.TipHighSpeedEntrance(item);
                    break;
                case '1501': // 上下线分离
                    ret = new FM.mapApi.render.data.TipMultiDigitized(item);
                    break;
                case '1502': // 路面覆盖 *
                    ret = new FM.mapApi.render.data.TipPavementCover(item);
                    break;
                case '1503': // 高架路
                    ret = new FM.mapApi.render.data.TipElevatedRoad(item);
                    break;
                case '1504': // overpass
                    ret = new FM.mapApi.render.data.TipOverpass(item);
                    break;
                case '1505': // underpass
                    ret = new FM.mapApi.render.data.TipUnderpass(item);
                    break;
                case '1506': // 私道
                    ret = new FM.mapApi.render.data.TipBypath(item);
                    break;
                case '1507': // 步行街 特殊线行
                    ret = new FM.mapApi.render.data.TipPedestrianStreet(item);
                    break;
                case '1508': // 公交专用道路
                    ret = new FM.mapApi.render.data.TipBusLane(item);
                    break;
                case '1509': // 跨线立交桥
                    ret = new FM.mapApi.render.data.TipCrossLineOverpass(item);
                    break;
                case '1510': // 桥 特殊线行
                    ret = new FM.mapApi.render.data.TipBridge(item);
                    break;
                case '1511': // 隧道 特殊线行
                    ret = new FM.mapApi.render.data.TipTunnel(item);
                    break;
                case '1512': // 辅路
                    ret = new FM.mapApi.render.data.TipSideRoad(item);
                    break;
                case '1513': // 窄道
                    ret = new FM.mapApi.render.data.TipNarrowChannel(item);
                    break;
                case '1514': // 施工 特殊线行
                    ret = new FM.mapApi.render.data.TipMaintenance(item);
                    break;
                case '1515': // 维修 特殊线行
                    ret = new FM.mapApi.render.data.TipRepair(item);
                    break;
                case '1516': // 季节性关闭道路
                    ret = new FM.mapApi.render.data.TipSeasonalRoad(item);
                    break;
                case '1517':// usage fee
                    ret = new FM.mapApi.render.data.TipUsageFeeRequired(item);
                    break;
                case '1601': // 环岛
                    ret = new FM.mapApi.render.data.TipRoundabout(item);
                    break;
                case '1602': // 特殊交通类型
                    ret = new FM.mapApi.render.data.TipSpecialTrafficType(item);
                    break;
                case '1604': // 区域内道路
                    ret = new FM.mapApi.render.data.TipRegionRoad(item);
                    break;
                case '1605': // POI连接路
                    ret = new FM.mapApi.render.data.TipPOIRoad(item);
                    break;
                case '1606': // 收费开放道路
                    ret = new FM.mapApi.render.data.TipChargeOpenRoad(item);
                    break;
                case '1607': // 风景路线
                    ret = new FM.mapApi.render.data.TipScenicRoute(item);
                    break;
                case '1701': // 障碍物
                    ret = new FM.mapApi.render.data.TipObstacle(item);
                    break;
                case '1702': // 铁路道口
                    ret = new FM.mapApi.render.data.TipRailwayCrossing(item);
                    break;
                case '1703': // 分叉路口提示
                    ret = new FM.mapApi.render.data.TipRoadCrossProm(item);
                    break;
                case '1704': // 交叉路口
                    ret = new FM.mapApi.render.data.TipRoadCross(item);
                    break;
                case '1705': // 立交桥名称
                    ret = new FM.mapApi.render.data.TipOverpassName(item);
                    break;
                case '1706': // GPS打点
                    ret = new FM.mapApi.render.data.TipGPSDot(item);
                    break;
                case '1116': // 立交 无deep，只有草图作为附件返回
                    ret = new FM.mapApi.render.data.TipGSC(item);
                    break;
                case '1803': // 挂接
                    ret = new FM.mapApi.render.data.TipConnect(item);
                    break;
                case '1804': // 顺行
                    ret = new FM.mapApi.render.data.TipDirect(item);
                    break;
                case '1806': // 草图
                    ret = new FM.mapApi.render.data.TipSketch(item);
                    break;
                case '8002': // 接边
                    ret = new FM.mapApi.render.data.TipBorder(item);
                    break;
                case '1901': // 道路名
                    ret = new FM.mapApi.render.data.TipRoadName(item);
                    break;
                case '2001': // 侧线
                    ret = new FM.mapApi.render.data.TipLinks(item);
                    break;
                case '2101': // 删除标记
                    ret = new FM.mapApi.render.data.TipDeleteTag(item);
                    break;
                case '2102': // 万能标记
                    ret = new FM.mapApi.render.data.TipGeneral(item);
                    break;
                case '8001': // fc 预处理
                    ret = new FM.mapApi.render.data.TipFC(item);
                    break;
                // 315不上线
                case '1108': // 减速带
                    ret = new FM.mapApi.render.data.TipSpeedBump(item);
                    break;
                case '1110': // 卡车限制
                    ret = new FM.mapApi.render.data.TipTruckLimit(item);
                    break;
                case '1112': // 可变限速
                    ret = new FM.mapApi.render.data.TipVariableSpeed(item);
                    break;
                case '1113': // 车道限速
                    ret = new FM.mapApi.render.data.TipDrivewayLimit(item);
                    break;
                case '1114': // 卡车限速
                    ret = new FM.mapApi.render.data.TipTruckSpeedLimit(item);
                    break;
                case '1115': // 车道变化点
                    ret = new FM.mapApi.render.data.TipLaneChangePoint(item);
                    break;
                case '1204': // 可逆车道
                    ret = new FM.mapApi.render.data.TipReversibleLane(item);
                    break;
                case '1303': // 卡车交限
                    ret = new FM.mapApi.render.data.TipTruckRestrictionTemp(item);
                    break;
                case '1306': // 路口语音引导
                    ret = new FM.mapApi.render.data.TipCrossVoiceGuide(item);
                    break;
                case '1307': // 自然语音引导
                    ret = new FM.mapApi.render.data.TipNatureVoiceGuide(item);
                    break;
                case '1308': // 禁止卡车驶入
                    ret = new FM.mapApi.render.data.TipBanTrucksIn(item);
                    break;
                case '1310': // 公交车道
                    ret = new FM.mapApi.render.data.TipBusDriveway(item);
                    break;
                case '1311': // 可变导向车道
                    ret = new FM.mapApi.render.data.TipVariableDirectionLane(item);
                    break;
                case '1401': // 方向看板
                    ret = new FM.mapApi.render.data.TipOrientation(item);
                    break;
                case '1402': // Real sign
                    ret = new FM.mapApi.render.data.TipRealSign(item);
                    break;
                case '1406': // 实景图
                    ret = new FM.mapApi.render.data.TipJVCBranch(item);
                    break;
                case '1409': // 普通路口模式图 315不上线
                    ret = new FM.mapApi.render.data.TipNormalCross(item);
                    break;
                case '1707': // 里程桩
                    ret = new FM.mapApi.render.data.TipMileagePeg(item);
                    break;
                //  新增
                case '2002': // ADAS测线
                    ret = new FM.mapApi.render.data.TipADASLink(item);
                    break;
                case '1708': // ADAS打点
                    ret = new FM.mapApi.render.data.TipADASNode(item);
                    break;
                case '1518': // 阶梯
                    ret = new FM.mapApi.render.data.TipStair(item);
                    break;
                case '2201': // 过街天桥
                    ret = new FM.mapApi.render.data.TipOverBridge(item);
                    break;
                case '1709': // 点位移
                    ret = new FM.mapApi.render.data.TipNodeShift(item);
                    break;
                case '1211': // 高速连接路
                    ret = new FM.mapApi.render.data.TipHighWayConnect(item);
                    break;
                case '1117': // 车道限宽限高
                    ret = new FM.mapApi.render.data.TipLaneLimitWidthHeight(item);
                    break;
                case '1214': // 删除在建属性
                    ret = new FM.mapApi.render.data.TipDeletePropertyInProgress(item);
                    break;
                case '1520': // 在建时间变更
                    ret = new FM.mapApi.render.data.TipBuildTimeChange(item);
                    break;
                //  未制作
                case '8005': // 机场功能面
                    ret = new FM.mapApi.render.data.TipAirPortFace(item);
                    break;
                case '8006': // Highway道路名
                    ret = new FM.mapApi.render.data.TipHighway(item);
                    break;
                case '8007': // AOI面
                    ret = new FM.mapApi.render.data.TipAOIFace(item);
                    break;
                case '8008': // AOI代表点
                    ret = new FM.mapApi.render.data.TipAOINode(item);
                    break;
                case '8009': // 地铁
                    ret = new FM.mapApi.render.data.TipRailWay(item);
                    break;
                case '8010': // BUA
                    ret = new FM.mapApi.render.data.TipBUAFace(item);
                    break;
                default:
                    break;
            }
            return ret;
        }
    }
});
