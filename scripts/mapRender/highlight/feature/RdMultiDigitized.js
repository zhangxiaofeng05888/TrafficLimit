/**
 * 定义‘上下线分离’要素选中时的高亮规则
 * @file      RdMultiDigitized.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDMULTIDIGITIZED = {
    type: 'geoLiveObject',
    topo: [{
        joinKey: 'nodePid',
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
        joinKey: 'joinLinks',
        highlight: {
            type: 'pid',
            layer: 'rdLink',
            zIndex: 1,
            defaultSymbol: 'ls_rdLink_via'
        }
    }]
};
