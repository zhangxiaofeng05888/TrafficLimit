/**
 * 定义‘道路线’要素选中时的高亮规则
 * @file      RdLinkByPid.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDLINKBYPID = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'rdLink',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'sNodePid',
        highlight: {
            type: 'pid',
            layer: 'rdNode',
            zIndex: 1,
            defaultSymbol: 'pt_node_s'
        }
    }, {
        joinKey: 'eNodePid',
        highlight: {
            type: 'pid',
            layer: 'rdNode',
            zIndex: 1,
            defaultSymbol: 'pt_node_e'
        }
    }]
};
