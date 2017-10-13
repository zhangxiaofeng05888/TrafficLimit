/**
 * 定义‘分叉路口提示’tips选中时的高亮规则
 * @file      TipRoadCrossProm.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPROADCROSSPROM = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPROADCROSSPROM',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'in',
                highlight: {
                    topo: [
                        {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'RDLINK',
                                zIndex: 1,
                                defaultSymbol: 'ls_rdLink_in'
                            }
                        }, {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'TIPLINKS',
                                zIndex: 1,
                                defaultSymbol: 'ls_rdLink_in'
                            }
                        }
                    ]
                }
            }, {
                joinKey: 'o_array',
                highlight: {
                    topo: [
                        {
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
                        }
                    ]
                }
            }]
        }
    }]
};
