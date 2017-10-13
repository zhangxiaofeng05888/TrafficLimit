/**
 * 定义‘路口’要素选中时的高亮规则
 * @file      RdCross.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDCROSS = {
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'RDLINK',
            zIndex: 0,
            defaultSymbol: 'ls_rdlink_cross'
        }
    }, {
        joinKey: 'nodes',
        highlight: {
            type: 'geoLiveObject',
            key: 'nodePid',
            layer: 'RDNODE',
            zIndex: 1,
            rule: {
                attribute: 'isMain',
                forks: [{
                    value: 1,
                    symbol: 'pt_rdNode_main'
                }],
                defaultSymbol: 'pt_rdNode_normal'
            }
        }
    }]
};
