/**
 * 定义‘土地利用点’要素选中时的高亮规则
 * @file      LuNode.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LUNODE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'LUNODE',
    zIndex: 1,
    defaultSymbol: 'pt_node',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'LULINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }]
};
