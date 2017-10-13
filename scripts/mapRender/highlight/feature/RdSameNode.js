/**
 * 定义‘同一点’要素选中时的高亮规则
 * @file      RdSameNode.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDSAMENODE = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RDSAMENODE',
    zIndex: 1,
    defaultSymbol: 'pt_rdSameNode'
};
