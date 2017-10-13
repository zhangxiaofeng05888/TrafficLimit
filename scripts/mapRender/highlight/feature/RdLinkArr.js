/**
 * 定义‘道路线’要素选中时的高亮规则
 * @file      RdLinkArr.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDLINKARR = {
    topo: [{
        joinKey: 'RDLINK',
        highlight: {
            type: 'pid',
            key: 'pid',
            layer: 'rdLink',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
