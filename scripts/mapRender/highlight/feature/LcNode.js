/**
 * 定义‘土地覆盖点’要素选中时的高亮规则
 * @file      LcNode.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.LCNODE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'LCNODE',
    zIndex: 1,
    defaultSymbol: 'pt_rdNode',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'LCLINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }]
};
