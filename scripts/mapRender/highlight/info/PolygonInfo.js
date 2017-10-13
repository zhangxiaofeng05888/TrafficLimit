/**
 * 定义‘面情报’要素选中时的高亮规则
 * @file      PolygonInfo.js
 * @author    ZhongXiaoMing
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.PolygonInfo = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'POLYGONINFO',
    zIndex: 0,
    defaultSymbol: 'py_face'
};
