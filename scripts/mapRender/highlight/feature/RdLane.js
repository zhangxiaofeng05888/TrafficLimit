/**
 * 定义‘详细车道’要素选中时的高亮规则
 * @file      RdLane.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDLANE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'rdLink',
    zIndex: 0,
    defaultSymbol: 'ls_link',
    topo: [{
        joinKey: 'linkPid',
        highlight: {
            type: 'pid',
            layer: 'rdLink',
            zIndex: 1,
            defaultSymbol: 'ls_link'
        }
    }]
};
