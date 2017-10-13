/**
 * 定义‘点情报’要素选中时的高亮规则
 * @file      PointInfo.js
 * @author    ZhongXiaoMing
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.PointInfo = {
    // highlight: {
    //     type: 'geometry',
    //     zIndex: 1,
    //     defaultSymbol: 'g_location'
    // }
    topo: [{
        joinKey: 'g_location',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'pt_poiLocation'
        }
    }]
};
