/**
 * 定义‘土地覆盖线’要素选中时的高亮规则
 * @file      LcLink.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LCLINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'LCLINK',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'LCNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'LCNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
