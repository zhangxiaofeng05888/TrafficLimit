/**
 * 定义‘市街图线’要素选中时的高亮规则
 * @file      CmgBuildLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.CMGBUILDLINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'CMGBUILDLINK',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'CMGBUILDNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'CMGBUILDNODE',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
