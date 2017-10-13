/**
 * 定义‘车信’tips选中时的高亮规则
 * @file      TipLaneConnexity.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPLANECONNEXITY = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPLANECONNEXITY',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
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
                joinKey: 'in',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'TIPLINKS',
                    zIndex: 2,
                    defaultSymbol: 'ls_rdLink_in'
                }
            }, {
                joinKey: 'o_array',
                highlight: {
                    topo: [{
                        joinKey: 'd_array',
                        highlight: {
                            topo: [{
                                joinKey: 'out',
                                highlight: {
                                    type: 'geoLiveObject',
                                    key: 'id',
                                    layer: 'RDLINK',
                                    zIndex: 3,
                                    defaultSymbol: 'ls_rdLink_out'
                                }
                            }]
                        }
                    }]
                }
            }]
        }
    }]
};
