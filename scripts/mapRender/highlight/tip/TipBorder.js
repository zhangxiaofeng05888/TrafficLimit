/**
 * 定义‘接边’tips选中时的高亮规则
 * @file      TipBorder.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPBORDER = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPBORDER',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'g_line',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'ls_boders'
        }
    }]
};

