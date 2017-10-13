/**
 * Created by chenxiao on 2016/5/3.
 * Class GeoDataModel GIS数据模型基类，继承于DataModel类
 * 继承后可重写相关的方法，一般要求重写geoLiveType属性，setAttributes、getSnapShot方法
 */
FM.dataApi.Feature = FM.dataApi.GeoDataModel.extend({
    /**
     * @geoLiveType
     * 模型类型
     */
    geoLiveType: 'FEATURE',
    /**
     * 对象初始化
     */
    initialize: function (data, options) {
        FM.dataApi.GeoDataModel.prototype.initialize.apply(this, arguments);
    },

    setAttributes: function (data) {
        FM.extend(this, data);
        this.pid = data.pid || 0;
        this.geoLiveType = data.geoLiveType || 'FEATURE';
    },

    statics: {
        create: function (data, options) {
            var ret = null;
            switch (data.geoLiveType) {
                case 'IXPOI':
                    ret = new fastmap.dataApi.IxPoi(data, options);
                    break;
                case 'RDNODE':
                    ret = new fastmap.dataApi.RdNode(data, options);
                    break;
                case 'RDLINK': // 红绿灯 *
                    ret = new fastmap.dataApi.RdLink(data, options);
                    break;
                case 'RDRESTRICTION':// 交限
                    ret = new fastmap.dataApi.RdRestriction(data, options);
                    break;
                case 'RDSPEEDLIMIT':// 点限速
                    ret = new fastmap.dataApi.RdSpeedLimit(data, options);
                    break;
                case 'RDBRANCH':// 分歧
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDHIGHSPEEDBRANCH':// 高速分歧
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDASPECTBRANCH':// 方面分歧
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDICBRANCH':// IC分歧
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RD3DBRANCH':// 3d分歧
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDCOMPLEXSCHEMA':// 复杂路口模式图
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDREALIMAGE':// 实景图
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDSIGNASREAL':// 实景看板
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDSERIESBRANCH':// 连续分歧
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDSCHEMATICBRANCH':// 交叉点大路口模式图
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDSIGNBOARD':// 方向看板
                    ret = new fastmap.dataApi.RdBranch(data, options);
                    break;
                case 'RDCROSS':// 路口
                    ret = new fastmap.dataApi.RdCross(data, options);
                    break;
                case 'RDLINKWARNING':// 危险信息
                    ret = new fastmap.dataApi.RdLinkWarning(data, options);
                    break;
                case 'RDTRAFFICSIGNAL':// 信号灯
                    ret = new fastmap.dataApi.RdTrafficSignal(data, options);
                    break;
                case 'RDELECTRONICEYE':// 电子眼
                    ret = new fastmap.dataApi.RdElectronicEye(data, options);
                    break;
                case 'RDGATE':// 大门
                    ret = new fastmap.dataApi.RdGate(data, options);
                    break;
                case 'RDSLOPE':// 坡度
                    ret = new fastmap.dataApi.RdSlope(data, options);
                    break;
                case 'RDLANECONNEXITY':// 车信
                    ret = new fastmap.dataApi.RdLaneConnexity(data, options);
                    break;
                case 'RDLINKINTRTIC':// 互联网RTIC
                    ret = new fastmap.dataApi.RdLinkIntRtic(data, options);
                    break;
                case 'RDDIRECTROUTE':// 顺行
                    ret = new fastmap.dataApi.RdDirectRoute(data, options);
                    break;
                case 'RDSPEEDBUMP':// 减速带 *
                    ret = new fastmap.dataApi.RdSpeedBump(data, options);
                    break;
                case 'RDSE':// 道路种别
                    ret = new fastmap.dataApi.RdSe(data, options);
                    break;
                case 'RDINTER':// CRF交叉点 *
                    ret = new fastmap.dataApi.RdInter(data, options);
                    break;
                case 'RDROAD':// CRF道路
                    ret = new fastmap.dataApi.RdRoad(data, options);
                    break;
                case 'RDOBJECT':// CRF对象
                    ret = new fastmap.dataApi.RdObject(data, options);
                    break;
                case 'RDTOLLGATE':// 收费站
                    ret = new fastmap.dataApi.RdTollgate(data, options);
                    break;
                case 'RDVARIABLESPEED':// 可变限速
                    ret = new fastmap.dataApi.RdVariableSpeed(data, options);
                    break;
                case 'RDMILEAGEPILE':// 里程桩 *
                    ret = new fastmap.dataApi.RdMileagePile(data, options);
                    break;
                case 'RDVOICEGUIDE':// 语音引导 *
                    ret = new fastmap.dataApi.RdVoiceGuide(data, options);
                    break;
                case 'RDGSC':// 立交
                    ret = new fastmap.dataApi.RdGsc(data, options);
                    break;
                case 'RWNODE':// 铁路点
                    ret = new fastmap.dataApi.RwNode(data, options);
                    break;
                case 'RWLINK':// 铁路线
                    ret = new fastmap.dataApi.RwLink(data, options);
                    break;
                case 'LCNODE':// 土地覆盖点
                    ret = new fastmap.dataApi.LcNode(data, options);
                    break;
                case 'LCLINK':// 土地覆盖线 *
                    ret = new fastmap.dataApi.LcLink(data, options);
                    break;
                case 'LCFACE':// 土地覆盖面 *
                    ret = new fastmap.dataApi.LcFace(data, options);
                    break;
                case 'LUNODE':// 土地利用点
                    ret = new fastmap.dataApi.LuNode(data, options);
                    break;
                case 'LULINK':// 土地利用线
                    ret = new fastmap.dataApi.LuLink(data, options);
                    break;
                case 'LUFACE':// 土地利用面
                    ret = new fastmap.dataApi.LuFace(data, options);
                    break;
                case 'CMGBUILDNODE':// 市街图点
                    ret = new fastmap.dataApi.CmgBuildNode(data, options);
                    break;
                case 'CMGBUILDLINK':// 市街图线
                    ret = new fastmap.dataApi.CmgBuildLink(data, options);
                    break;
                case 'CMGBUILDFACE':// 市街图面
                    ret = new fastmap.dataApi.CmgBuildFace(data, options);
                    break;
                case 'CMGBUILDING':// 市街图feature
                    ret = new fastmap.dataApi.CmgBuilding(data, options);
                    break;
                case 'ADADMIN':// 行政区划代表点
                    ret = new fastmap.dataApi.AdAdmin(data, options);
                    break;
                case 'ADNODE':// 行政区划组成点
                    ret = new fastmap.dataApi.AdNode(data, options);
                    break;
                case 'ADLINK':// 行政区划组成线
                    ret = new fastmap.dataApi.AdLink(data, options);
                    break;
                case 'ADFACE':// 行政区划面
                    ret = new fastmap.dataApi.AdFace(data, options);
                    break;
                case 'ZONENODE':// Zone点 *
                    ret = new fastmap.dataApi.ZoneNode(data, options);
                    break;
                case 'ZONELINK':// ZONE线
                    ret = new fastmap.dataApi.ZoneLink(data, options);
                    break;
                case 'ZONEFACE':// ZONE面
                    ret = new fastmap.dataApi.ZoneFace(data, options);
                    break;
                case 'RDSAMENODE':// 同一点
                    ret = new fastmap.dataApi.RdSameNode(data, options);
                    break;
                case 'RDSAMELINK':// 同一线
                    ret = new fastmap.dataApi.RdSameLink(data, options);
                    break;
                case 'RDLINKSPEEDLIMIT':// 线限速
                    ret = new fastmap.dataApi.RdLinkSpeedLimit(data, options);
                    break;
                case 'RDHGWGLIMIT':// 限高限重
                    ret = new fastmap.dataApi.RdHgwgLimit(data, options);
                    break;
                case 'RDLANE':// 详细车道 *
                    ret = new fastmap.dataApi.RdLanes(data, options);
                    break;
                case 'TMCPOINT':// TMC点
                    ret = new fastmap.dataApi.TMCPoint(data, options);
                    break;
                case 'TMCLINE':// TMCLine
                    ret = new fastmap.dataApi.TMCLine(data, options);
                    break;
                case 'RDTMCLOCATION':// TMC匹配信息
                    ret = new fastmap.dataApi.RdTmcLocation(data, options);
                    break;
                case 'ROADNAME':// 道路名
                    ret = new fastmap.dataApi.RoadName(data, options);
                    break;
                case 'SCROADNAMEHWINFO':// 高速道路名
                    ret = new fastmap.dataApi.ScRoadNameHwInfo(data, options);
                    break;
                case 'SCMODELMATCHG':// 模式图匹配表
                    ret = new fastmap.dataApi.ScModelMatchG(data, options);
                    break;
                case 'RDLANETOPODETAILARR':// 车道连通
                    ret = new fastmap.dataApi.RdLaneTopoDetailArr(data, options);
                    break;
                default:
                    ret = new fastmap.dataApi.Feature(data, options);
                    break;
            }
            return ret;
        }
    }
});
