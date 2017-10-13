/**
 * 定义‘铁路道口’tips选中时的高亮规则
 * @file      TipRailwayCrossing.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPRAILWAYCROSSING = {  // 铁路道口
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPRAILWAYCROSSING',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'f',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }]
        }
    }]
};

