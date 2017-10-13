/**
 * 定义‘行政区划组成线’要素选中时的高亮规则
 * @file      AdLink.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.ADLINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'ADLINK',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'ADNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'ADNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
