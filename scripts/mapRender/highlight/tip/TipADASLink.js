/**
 * 定义‘ADAS测线’tips选中时的高亮规则
 * @file      TipADASLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPADASLINK = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPADASLINK',
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
                    defaultSymbol: 'ls_boders'
                }
            }]
        }
    }]
};
