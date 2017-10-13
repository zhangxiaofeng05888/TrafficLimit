/**
 * 定义‘上下线分离’tips选中时的高亮规则
 * @file      TipMultiDigitized.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPMULTIDIGITIZED = {
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'gSLoc',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'tip_circle'
                }
            }, {
                joinKey: 'gELoc',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'tip_circle'
                }
            }, {
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
