/**
 * 定义‘行政区划代表点’要素选中时的高亮规则
 * @file      AdAdmin.js
 * @author    LingLong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.ADADMIN = {
    key: 'pid',
    layer: 'ADADMIN',
    type: 'geoLiveObject',
    zIndex: 1,
    defaultSymbol: 'pt_feature_relationBorder',
    topo: [{
        joinKey: 'guideLink',
        highlight: {
            type: 'geometry',
            zIndex: 0,
            defaultSymbol: 'ls_guideLink'
        }
    }, {
        joinKey: 'guidePoint',
        highlight: {
            type: 'geometry',
            zIndex: 1,
            defaultSymbol: 'pt_poiGuide'
        }
    }]
};
