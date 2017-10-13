/**
 * 定义‘坡度’tips选中时的高亮规则
 * @file      TipSlope.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPSLOPE = {  // 1106 坡度 *
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPSLOPE',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'out',
                highlight: {
                    topo: [
                        {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'RDLINK',
                                zIndex: 1,
                                defaultSymbol: 'ls_rdLink_out'
                            }
                        }, {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'TIPLINKS',
                                zIndex: 1,
                                defaultSymbol: 'ls_rdLink_out'
                            }
                        }
                    ]
                }
            }]
        }
    }]
};
