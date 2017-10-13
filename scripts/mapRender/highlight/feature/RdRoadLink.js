/**
 * 定义‘crf道路’要素选中时的高亮规则
 * @file      RdRoadLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDROAD = {
    topo: [{
        joinKey: 'links',
        highlight: {
            type: 'geoLiveObject',
            key: 'linkPid',
            layer: 'RDLINK',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
