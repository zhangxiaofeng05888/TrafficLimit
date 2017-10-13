/**
 * 定义‘行政区划组成点’要素选中时的高亮规则
 * @file      AdNode.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.ADNODE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'ADNODE',
    zIndex: 1,
    defaultSymbol: 'pt_node',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'ADLINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }]
};
