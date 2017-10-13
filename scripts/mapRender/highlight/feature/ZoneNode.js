/**
 * 定义‘Zone点’要素选中时的高亮规则
 * @file      ZoneNode.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.ZONENODE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'ZONENODE',
    zIndex: 1,
    defaultSymbol: 'pt_node',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'ZONELINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }]
};
