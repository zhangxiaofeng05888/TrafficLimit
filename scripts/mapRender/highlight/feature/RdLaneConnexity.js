/**
 * 定义‘车信’要素选中时的高亮规则
 * @file      RdLaneConnexity.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDLANECONNEXITY = {
    type: 'symbol',
    key: 'pid',
    layer: 'RDLANECONNEXITY',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'nodePid',
        highlight: {
            type: 'pid',
            layer: 'RDNODE',
            zIndex: 2,
            defaultSymbol: 'relationEdit_pt_node'
        }
    }, {
        joinKey: 'inLinkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'relationEdit_ls_inLink'
        }
    }, {
        joinKey: 'topos',
        highlight: {
            topo: [{
                joinKey: 'outLinkPid',
                highlight: {
                    type: 'pid',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'relationEdit_ls_outLink'
                }
            }, {
                joinKey: 'vias',
                highlight: {
                    topo: [{
                        joinKey: 'linkPid',
                        highlight: {
                            type: 'pid',
                            layer: 'RDLINK',
                            zIndex: 1,
                            defaultSymbol: 'relationEdit_ls_viaLink'
                        }
                    }]
                }
            }]
        }
    }]
};

