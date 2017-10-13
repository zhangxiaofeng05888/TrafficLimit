/**
 * 定义‘收费站’tips选中时的高亮规则
 * @file      TipTollGate.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPTOLLGATE = {  // 1107 收费站
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPTOLLGATE',
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
            }, {
                joinKey: 'out',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'TIPLINKS',
                    zIndex: 1,
                    defaultSymbol: 'ls_rdLink_out'
                }
            }]
        }
    }]
};
