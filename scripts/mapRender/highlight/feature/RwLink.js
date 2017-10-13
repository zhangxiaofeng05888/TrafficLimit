/**
 * 定义‘铁路线’要素选中时的高亮规则
 * @file      RwLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RWLINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RWLINK',
    zIndex: 0,
    defaultSymbol: 'ls_rwLink',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'RWNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'RWNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
