/**
 * 专题图要素渲染数据模型的基类
 * @class FM.mapApi.render.data.Thematic
 * @author ChenXiao
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.Thematic = FM.mapApi.render.data.DataModel.extend({
    /**
     * 模型转换初始化函数，在这里对公共属性进行初始化
     * @method initialize
     * @author ChenXiao
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    initialize: function (data) {
        this.type = 'thematic';
        this.geometry = null;
        this.properties = null;

        if (data) {
            this.geometry = {};
            this.geometry.type = 'LineString';
            this.geometry.coordinates = data.g;

            this.properties = {};
            this.properties.id = data.i;
            this.properties.TMCode = data.t;
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
         * @param  {object} data 接口返回的数据
         * @return {object}  要素渲染数据模型
         */
        create: function (data) {
            var ret = null;
            switch (data.t) {
                case 501: // 专题图 卡车限制信息
                    ret = new FM.mapApi.render.data.TMTruckLimitData(data);
                    break;
                case 502: // 专题图 link限制信息数量（普通限制信息）
                    ret = new FM.mapApi.render.data.TMLinkLimitNum(data);
                    break;
                case 503: // 专题图 普通线限速限速等级
                    ret = new FM.mapApi.render.data.TMLinkSpeedlimitSpeedClass(data);
                    break;
                case 504: // 专题图 普通线限速限速等级赋值标识
                    ret = new FM.mapApi.render.data.TMLinkSpeedlimitSpeedClassWork(data);
                    break;
                case 505: // 专题图 普通线限速限速来源
                    ret = new FM.mapApi.render.data.TMLinkSpeedlimitSpeedLimitSrc(data);
                    break;
                case 506: // 专题图 link车道等级
                    ret = new FM.mapApi.render.data.TMLinkLaneClass(data);
                    break;
                case 507: // 专题图 link功能等级
                    ret = new FM.mapApi.render.data.TMLinkFunctionClass(data);
                    break;
                case 508: // 专题图 车道数(总数)
                    ret = new FM.mapApi.render.data.TMLinkLaneNum(data);
                    break;
                case 509: // 专题图 开发状态
                    ret = new FM.mapApi.render.data.TMDevelopState(data);
                    break;
                case 510: // 专题图 上下线分离
                    ret = new FM.mapApi.render.data.TMMultiDigitized(data);
                    break;
                case 511: // 专题图 铺设状态
                    ret = new FM.mapApi.render.data.TMPaveStatus(data);
                    break;
                case 512: // 专题图 收费信息
                    ret = new FM.mapApi.render.data.TMTollInfo(data);
                    break;
                case 513: // 专题图 特殊交通
                    ret = new FM.mapApi.render.data.TMSpecialTraffic(data);
                    break;
                case 514: // 专题图 高架
                    ret = new FM.mapApi.render.data.TMIsViaduct(data);
                    break;
                case 515: // 专题图 供用信息
                    ret = new FM.mapApi.render.data.TMAppInfo(data);
                    break;
                case 516: // 专题图 交叉口内道路
                    ret = new FM.mapApi.render.data.TMRdLinkForm(data);
                    break;
                case 517: // 专题图 道路名内容
                    ret = new FM.mapApi.render.data.TMNameContent(data);
                    break;
                case 518: // 专题图 道路名组数
                    ret = new FM.mapApi.render.data.TMNameGroupid(data);
                    break;
                case 519: // 专题图 名称类型
                    ret = new FM.mapApi.render.data.TMNameType(data);
                    break;
                case 520: // 专题图 条件线限速个数
                    ret = new FM.mapApi.render.data.TMSpeedlimitConditionCount(data);
                    break;
                case 521: // 专题图 禁止穿行
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType(data);
                    break;
                case 522: // 专题图 IC
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay10(data);
                    break;
                case 523: // 专题图 JCT
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay11(data);
                    break;
                case 524: // 专题图 SA
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay12(data);
                    break;
                case 525: // 专题图 PA
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay13(data);
                    break;
                case 526: // 专题图 全封闭道路
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay14(data);
                    break;
                case 527: // 专题图 匝道
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay15(data);
                    break;
                case 528: // 专题图 跨线天桥
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay16(data);
                    break;
                case 529: // 专题图 跨线地道
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay17(data);
                    break;
                case 530: // 专题图 步行街
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay20(data);
                    break;
                case 531: // 专题图 隧道
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay31(data);
                    break;
                case 532: // 专题图 环岛
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay33(data);
                    break;
                case 533: // 专题图 辅路
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay34(data);
                    break;
                case 534: // 专题图 调头口
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay35(data);
                    break;
                case 535: // 专题图 POI连接路
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay36(data);
                    break;
                case 536: // 专题图 提右
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay37(data);
                    break;
                case 537: // 专题图 提左
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay38(data);
                    break;
                case 538: // 专题图 主辅路出入口
                    ret = new FM.mapApi.render.data.TMRdLinkFormOfWay39(data);
                    break;
                case 539: // 专题图 道路维修中
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType0(data);
                    break;
                case 540: // 专题图 外地车限行
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType8(data);
                    break;
                case 541: // 专题图 尾号限行
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType9(data);
                    break;
                case 542: // 专题图 在建
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType10(data);
                    break;
                case 543: // 专题图 车辆限制
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType2(data);
                    break;
                case 544: // 专题图 季节性关闭道路
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType5(data);
                    break;
                case 545: // 专题图 Usage fee required
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType6(data);
                    break;
                case 546: // 专题图 超车限制
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType7(data);
                    break;
                case 547: // 专题图 单行限制
                    ret = new FM.mapApi.render.data.TMRdLinkLimitType1(data);
                    break;
                case 548: // 专题图 RTIC 等级
                    ret = new FM.mapApi.render.data.TMRdLinkRticRank(data);
                    break;
                case 549: // 专题图 IntRtic等级
                    ret = new FM.mapApi.render.data.TMRdLinkIntRticRank(data);
                    break;
                case 550: // 专题图 ZONE类型
                    ret = new FM.mapApi.render.data.TMRdLinkZoneTpye(data);
                    break;
                case 551: // 专题图 ZONE个数
                    ret = new FM.mapApi.render.data.TMRdLinkZoneCount(data);
                    break;
                case 552: // 专题图 link的左右ZONE号码
                    ret = new FM.mapApi.render.data.TMRdLinkZoneSide(data);
                    break;
                case 553: // 专题图 临时对三个场景处理为专题图
                    ret = new FM.mapApi.render.data.TMRdLinkProperty(data);
                    break;
                case 554: // 专题图 imi
                    ret = new FM.mapApi.render.data.TMIMI(data);
                    break;
                case 555: // 专题图 城市道路
                    ret = new FM.mapApi.render.data.TMRdLinkUrban(data);
                    break;
                case 556: // 专题图 行人步行属性
                    ret = new FM.mapApi.render.data.TMRdLinkWalk(data);
                    break;
                case 557: // 专题图 人行便道标记
                    ret = new FM.mapApi.render.data.TMRdLinkSidewalk(data);
                    break;
                case 558: // 专题图 人行阶梯标记
                    ret = new FM.mapApi.render.data.TMRdLinkWalkstair(data);
                    break;
                default:
                    break;
            }
            return ret;
        }
    }
});
