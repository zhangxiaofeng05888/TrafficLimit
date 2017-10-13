/**
 * 定义‘TMCLine’要素选中时的高亮规则
 * @file      TMCLine.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TMCLINE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'tmcData',
    zIndex: 0,
    defaultSymbol: 'tmc_line'
};
