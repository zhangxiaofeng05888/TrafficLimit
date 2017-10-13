/**
 * 定义‘道路线’要素选中时的高亮规则
 * @file      RdLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDLINK = {
    topo: [{
        joinKey: 'geometry',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }, {
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'RDNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'RDNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
