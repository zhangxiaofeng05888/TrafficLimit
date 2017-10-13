/**
 * 定义‘线情报’要素选中时的高亮规则
 * @file      LineInfo.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LineInfo = {
    topo: [{
        joinKey: 'g_location',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
