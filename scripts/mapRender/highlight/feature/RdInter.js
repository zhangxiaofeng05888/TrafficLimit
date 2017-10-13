/**
 * 定义‘CRF交叉点’要素选中时的高亮规则
 * @file      RdInter.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDINTER = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'RDINTER',
    zIndex: 0,
    defaultSymbol: 'pt_feature_relationBorder',
    topo: [{
        joinKey: 'links',
        highlight: {
            key: 'linkPid',
            type: 'geoLiveObject',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }, {
        joinKey: 'nodes',
        highlight: {
            key: 'nodePid',
            type: 'geoLiveObject',
            layer: 'RDNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_cross'
        }
    }]
};
