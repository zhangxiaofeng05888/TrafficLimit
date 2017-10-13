/**
 * 定义‘顺行’tips选中时的高亮规则
 * @file      TipDirect.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPDIRECT = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPDIRECT',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'in',
        highlight: {
            type: 'geoLiveObject',
            key: 'id',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }, {
        joinKey: 'out',
        highlight: {
            type: 'geoLiveObject',
            key: 'id',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_out'
        }
    }]
};
