/**
 * 定义‘公交车道’tips选中时的高亮规则
 * @file      TipBusDriveway.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPBUSDRIVEWAY = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPBUSDRIVEWAY',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
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
            }, {
                joinKey: 'ln',
                highlight: {
                    topo: [
                        {
                            joinKey: 'o_array',
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
