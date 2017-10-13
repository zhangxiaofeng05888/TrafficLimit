/**
 * 定义‘TMC点’要素选中时的高亮规则
 * @file      TMCPoint.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TMCPOINT = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'tmcData',
    zIndex: 0,
    defaultSymbol: 'pt_feature_relationBorder'
};
