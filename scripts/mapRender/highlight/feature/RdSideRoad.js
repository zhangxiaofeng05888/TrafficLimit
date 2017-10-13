/**
 * 定义‘辅路’要素选中时的高亮规则
 * @file      RdSideRoad.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDSIDEROAD = {
    type: 'geoLiveObject',
    topo: [{
        joinKey: 'inNodePid',
        highlight: {
            type: 'pid',
            layer: 'rdNode',
            zIndex: 2,
            defaultSymbol: 'pt_rdNode_in'
        }
    }, {
        joinKey: 'inLinkPid',
        highlight: {
            type: 'pid',
            layer: 'rdLink',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_in'
        }
    }, {
        joinKey: 'joinLinkPids',
        highlight: {
            type: 'pid',
            layer: 'rdLink',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_via'
        }
    }]
};
