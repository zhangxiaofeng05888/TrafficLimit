/**
 * 定义‘铁路点’要素选中时的高亮规则
 * @file      RwNode.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RWNODE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RWNODE',
    zIndex: 1,
    defaultSymbol: 'pt_node',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'RWLINK',
            zIndex: 0,
            defaultSymbol: 'ls_rwLink'
        }
    }]
};
