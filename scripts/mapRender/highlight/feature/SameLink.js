/**
 * 定义‘同一线’要素选中时的高亮规则
 * @file      SameLink.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.SAMELINK = {
    topo: [{
        joinKey: 'RDLINK',
        highlight: {
            type: 'pid',
            key: 'pid',
            layer: 'rdLink',
            zIndex: 0,
            defaultSymbol: 'ls_rdLink_same'
        }
    }, {
        joinKey: 'ADLINK',
        highlight: {
            type: 'pid',
            key: 'pid',
            layer: 'adLink',
            zIndex: 1,
            defaultSymbol: 'ls_adLink_same'
        }
    }, {
        joinKey: 'ZONELINK',
        highlight: {
            type: 'pid',
            key: 'pid',
            layer: 'zoneLink',
            zIndex: 1,
            defaultSymbol: 'ls_zoneLink_same'
        }
    }, {
        joinKey: 'LULINK',
        highlight: {
            type: 'pid',
            key: 'pid',
            layer: 'luLink',
            zIndex: 1,
            defaultSymbol: 'ls_luLink_same'
        }
    }]
};
