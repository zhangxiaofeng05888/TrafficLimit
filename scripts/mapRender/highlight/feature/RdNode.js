/**
 * 定义‘道路点’要素选中时的高亮规则
 * @file      RdNode.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDNODE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RDNODE',
    zIndex: 1,
    defaultSymbol: 'pt_rdNode',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }]
};
