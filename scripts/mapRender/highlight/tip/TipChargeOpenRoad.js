/**
 * 定义‘收费开放道路’tips选中时的高亮规则
 * @file      TipChargeOpenRoad.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPCHARGEOPENROAD = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPCHARGEOPENROAD',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'geometry',
        highlight: {
            topo: [{
                joinKey: 'g_location',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'py_tip_Polygon'
                }
            }]
        }
    }, {
        joinKey: 'deep',
        highlight: {
            topo: [
                {
                    joinKey: 'f_array',
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
                }
            ]
        }
    }]
};

