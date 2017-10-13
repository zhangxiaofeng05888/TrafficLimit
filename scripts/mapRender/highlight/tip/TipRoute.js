/**
 * 定义‘航线’tips选中时的高亮规则
 * @file      TipRoute.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPROUTE = { // 1209 航线
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPROUTE',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'f',
        highlight: {
            type: 'geoLiveObject',
            key: 'id',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }]
};

