/**
 * 定义‘ZONE线’要素选中时的高亮规则
 * @file      ZoneLink.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.ZONELINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'ZONELINK',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'ZONENODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'ZONENODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
