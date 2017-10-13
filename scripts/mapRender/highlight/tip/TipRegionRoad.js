/**
 * 定义‘区域内道路’tips选中时的高亮规则
 * @file      TipRegionRoad.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPREGIONROAD = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPREGIONROAD',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'geometry',
        highlight: {
            topo: [{
                joinKey: 'g_location',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'py_tip_Polygon'
                }
            }]
        }
    }, {
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'f_array',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }, {
                joinKey: 'f_array',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'TIPLINKS',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }]
        }
    }]
};
