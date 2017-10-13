/**
 * 定义‘立交（草图）’tips选中时的高亮规则
 * @file      TipGSC.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.TIPGSC = {
    type: 'symbol',
    key: 'rowkey',
    layer: 'TIPGSC',
    zIndex: 0,
    defaultSymbol: 'tip_circle',
    topo: [{
        joinKey: 'deep',
        highlight: {
            topo: [{
                joinKey: 'f_array',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }, {
                joinKey: 'f_array',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'TIPLINKS',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }, {
                joinKey: 'f_array',
                highlight: {
                    type: 'geoLiveObject',
                    key: 'id',
                    layer: 'RWLINK',
                    zIndex: 1,
                    defaultSymbol: 'ls_boders'
                }
            }]
        }
    }]
};

