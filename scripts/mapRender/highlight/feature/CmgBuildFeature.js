/**
 * 定义‘市街图feature’要素选中时的高亮规则
 * @file      CmgBuildFeature.js
 * @author    MaLi
 * @date      2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */

FM.mapApi.render.highlight.CMGBUILDING = {
    key: 'pid',
    type: 'geoLiveObject',
    layer: 'CMGBUILDING',
    zIndex: 0,
    defaultSymbol: 'cmgFeature_face'
};
