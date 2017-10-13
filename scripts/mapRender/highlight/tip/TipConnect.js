/**
 * 定义‘挂接’tips选中时的高亮规则
 * @file      TipConnect.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPCONNECT = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPCONNECT',
    zIndex: 0,
    defaultSymbol: 'tip_circle'
};
