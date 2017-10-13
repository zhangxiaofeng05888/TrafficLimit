/**
 * 定义‘道路名’tips选中时的高亮规则
 * @file      TipRoadName.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPROADNAME = {
    topo: [{
        joinKey: 'geometry',
        highlight: {
            topo: [{
                joinKey: 'g_location',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }, {
                joinKey: 'g_guide',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'tip_circle'
                }
            }]
        }
    }]
};
