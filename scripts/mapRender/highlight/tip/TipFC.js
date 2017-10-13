/**
 * 定义‘fc预处理’tips选中时的高亮规则
 * @file      TipFC.js
 * @author    ZhongXiaoMing
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

fastmap.mapApi.HighlightTipsRules = fastmap.mapApi.HighlightTipsRules || {};
FM.mapApi.render.highlight.TIPFC = {
    topo: [{
        joinKey: 'geometry',
        highlight: {
            topo: [{
                joinKey: 'g_location',
                highlight: {
                    type: 'geometry',
                    zIndex: 1,
                    defaultSymbol: 'ls_rdLink_in'
                }
            }]
        }
    }]
};
