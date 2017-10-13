/**
 * 定义‘卡车限制’tips选中时的高亮规则
 * @file      TipTruckLimit.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPTRUCKLIMIT = {  // 1110 卡车限制
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPTRUCKLIMIT',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'f',
                highlight: {
                    topo: [
                        {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'RDLINK',
                                zIndex: 1,
                                defaultSymbol: 'ls_boders'
                            }
                        }, {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'TIPLINKS',
                                zIndex: 1,
                                defaultSymbol: 'ls_boders'
                            }
                        }
                    ]
                }
            }]
        }
    }]
};
