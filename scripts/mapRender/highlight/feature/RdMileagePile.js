/**
 * 定义‘里程桩’要素选中时的高亮规则
 * @file      RdMileagePile.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDMILEAGEPILE = {
    type: 'symbol',
    key: 'pid',
    layer: 'RDMILEAGEPILE',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'linkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }]
};
