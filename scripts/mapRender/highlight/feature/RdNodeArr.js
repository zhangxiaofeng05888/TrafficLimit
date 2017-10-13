/**
 * 定义‘道路点’要素选中时的高亮规则
 * @file      RdNodeArr.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDNODEARR = {
    topo: [{
        joinKey: 'RDNODE',
        highlight: {
            type: 'pid',
            key: 'pid',
            layer: 'rdNode',
            zIndex: 1,
            defaultSymbol: 'pt_rdNode'
        }
    }]
};
