/**
 * 定义‘车道变化点’tips选中时的高亮规则
 * @file      TipLaneChangePoint.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPLANECHANGEPOINT = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPLANECHANGEPOINT',
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
                        }, {
                            joinKey: 'id',
                            highlight: {
                                type: 'pid',
                                layer: 'RDNODE',
                                zIndex: 1,
                                defaultSymbol: 'pt_node_e'
                            }
                        }
                    ]
                }
            }]
        }
    }, {
        joinKey: 'deep',
        highlight: {
            type: 'geoLiveObject',
            key: 'inLink',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }, {
        joinKey: 'deep',
        highlight: {
            type: 'geoLiveObject',
            key: 'outLink',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_out'
        }
    }]
};
