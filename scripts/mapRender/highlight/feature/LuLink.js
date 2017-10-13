/**
 * 定义‘土地利用线’要素选中时的高亮规则
 * @file      LuLink.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LULINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'LULINK',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'LUNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'LUNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
