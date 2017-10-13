/**
 * 定义‘市街图点’要素选中时的高亮规则
 * @file      CmgBuildNode.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.CMGBUILDNODE = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'CMGBUILDNODE',
    zIndex: 1,
    defaultSymbol: 'pt_node',
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'pid',
            layer: 'CMGBUILDLINK',
            zIndex: 0,
            defaultSymbol: 'ls_link'
        }
    }]
};
