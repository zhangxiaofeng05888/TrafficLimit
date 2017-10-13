/**
 * 定义‘POI’要素选中时的高亮规则
 * @file      IxPoi.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.IXPOI = {
    // type: 'geometry',
    // key: 'pid',
    // layer: 'poi',
    // zIndex: 1,
    // defaultSymbol: 'pt_poiLocation',

    // 为了兼容深度信息的高亮，不从图层里取poi的显示坐标高亮了，直接写到topo里
    topo: [{
        joinKey: 'geometry',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'pt_poiLocation'
        }
    }, {
        joinKey: 'guide',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'pt_poiGuide'
        }
    }, {
        joinKey: 'guideLink',
        highlight: {
            type: 'geometry',
            zIndex: 0,
            defaultSymbol: 'ls_guideLink'
        }
    }]
};
