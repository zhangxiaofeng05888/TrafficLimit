/**
 * 定义‘点限速’要素选中时的高亮规则
 * @file      RdSpeedLimit.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDSPEEDLIMIT = {
    type: 'symbol',
    key: 'pid',
    layer: 'RDSPEEDLIMIT',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'linkPid',
        highlight: {
            type: 'pid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
