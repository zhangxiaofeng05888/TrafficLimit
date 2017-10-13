/**
 * 定义‘同一线’要素选中时的高亮规则
 * @file      RdSameLink.js
 * @author    LiuZhe
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.RDSAMELINK = {
    type: 'geoLiveObject',
    key: 'pid',
    layer: 'RDSAMELINK',
    zIndex: 0,
    defaultSymbol: 'ls_sameLink'
};
