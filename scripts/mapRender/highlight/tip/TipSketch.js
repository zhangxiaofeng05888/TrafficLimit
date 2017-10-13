/**
 * 定义‘草图’tips选中时的高亮规则
 * @file      TipSketch.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPSKETCH = {
    topo: [{
        joinKey: 'geometry',
        highlight: {
            topo: [{
                joinKey: 'g_location',
                highlight: {
                    type: 'geometry',
                    zIndex: 3,
                    defaultSymbol: 'tip_circle'
                }
            }]
        }
    }, {
        joinKey: 'g_point',
        highlight: {
            type: 'geometry',
            zIndex: 2,
            defaultSymbol: 'pt_tip_point'
        }
    }, {
        joinKey: 'g_line',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'ls_boders'
        }
    }, {
        joinKey: 'g_polygon',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'py_tip_Polygon'
        }
    }]
};
