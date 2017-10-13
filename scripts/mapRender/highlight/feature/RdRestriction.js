/**
 * 定义‘交限’要素选中时的高亮规则
 * @file      RdRestriction.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDRESTRICTION = {
    type: 'symbol',
    key: 'pid',
    layer: 'RDRESTRICTION',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'nodePid',
        highlight: {
            type: 'pid',
            layer: 'RDNODE',
            zIndex: 1,
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
        joinKey: 'details',
        highlight: {
            topo: [{
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
            }, {
                joinKey: 'outLinkPid',
                highlight: {
                    type: 'pid',
                    layer: 'RDLINK',
                    zIndex: 1,
                    defaultSymbol: 'relationEdit_ls_outLink'
                }
            }]
        }
    }]
};
