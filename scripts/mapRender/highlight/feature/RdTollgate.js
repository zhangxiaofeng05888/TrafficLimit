/**
 * 定义‘收费站’要素选中时的高亮规则
 * @file      RdTollgate.js
 * @author    WangMingDong
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDTOLLGATE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'RDTOLLGATE',
    zIndex: 0,
    defaultSymbol: 'pt_feature_relationBorder',
    topo: [{
        joinKey: 'nodePid',
        highlight: {
            type: 'pid',
            layer: 'RDNODE',
            zIndex: 2,
            defaultSymbol: 'pt_rdNode_in'
        }
    }, {
        joinKey: 'inLinkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }, {
        joinKey: 'outLinkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_out'
        }
    }]
};
